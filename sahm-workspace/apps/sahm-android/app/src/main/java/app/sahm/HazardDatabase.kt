package app.sahm

import android.content.ContentValues
import android.content.Context
import android.database.Cursor as SqlCursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import app.sahm.core.*
import kotlin.math.*

/** Call on a serial IO dispatcher/mutex, never the GPS or UI thread. */
class HazardDatabase(context: Context, name: String = "sahm-hazards.db") : SQLiteOpenHelper(context, name, null, 1) {
    override fun onConfigure(db: SQLiteDatabase) { db.setForeignKeyConstraintsEnabled(true) }
    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("CREATE TABLE hazards(id TEXT PRIMARY KEY,country TEXT NOT NULL,kind TEXT NOT NULL,lat REAL NOT NULL CHECK(lat BETWEEN -90 AND 90),lon REAL NOT NULL CHECK(lon BETWEEN -180 AND 180),heading REAL,road TEXT NOT NULL,expires INTEGER NOT NULL,demo INTEGER NOT NULL,revision INTEGER NOT NULL,layer TEXT NOT NULL CHECK(layer IN ('static','live')))")
        db.execSQL("CREATE INDEX hazards_bbox ON hazards(country,lat,lon)")
        db.execSQL("CREATE INDEX hazards_expiry ON hazards(expires)")
        db.execSQL("CREATE TABLE sync_meta(scope TEXT PRIMARY KEY,country TEXT NOT NULL,epoch TEXT NOT NULL,cursor INTEGER NOT NULL,checked INTEGER NOT NULL)")
        db.execSQL("CREATE TABLE versions(id TEXT PRIMARY KEY,country TEXT NOT NULL,revision INTEGER NOT NULL)")
        db.execSQL("CREATE TABLE memberships(scope TEXT NOT NULL,id TEXT NOT NULL REFERENCES hazards(id) ON DELETE CASCADE,PRIMARY KEY(scope,id))")
        db.execSQL("CREATE TABLE packs(country TEXT PRIMARY KEY,revision INTEGER NOT NULL)")
    }
    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) { error("Explicit non-destructive migration required: $oldVersion -> $newVersion") }
    fun seed(country: String, revision: Int, hazards: List<Hazard>) {
        require(country in COUNTRIES && hazards.all { it.country==country && it.id.startsWith("static:") })
        val db=writableDatabase
        transaction(db) {
            val current=db.rawQuery("SELECT revision FROM packs WHERE country=?",arrayOf(country)).use { if(it.moveToFirst())it.getInt(0) else 0 }
            if(current>=revision)return@transaction
            db.delete("hazards","country=? AND layer='static'",arrayOf(country))
            hazards.forEach { put(db,it,"static") }
            db.execSQL("INSERT OR REPLACE INTO packs VALUES(?,?)",arrayOf<Any>(country,revision))
        }
    }
    fun cursor(scope: Scope): Cursor = readableDatabase.rawQuery("SELECT epoch,cursor FROM sync_meta WHERE scope=?",arrayOf(scope.key)).use {
        if(it.moveToFirst())Cursor(it.getString(0),it.getLong(1)) else Cursor("",0)
    }
    /** Validates then atomically commits records, tombstones, memberships, and cursor. */
    fun apply(scope: Scope, delta: Delta, now: Long) {
        val db=writableDatabase
        transaction(db) {
            delta.validate(scope,cursor(scope))
            val knownEpochs=db.rawQuery("SELECT DISTINCT epoch FROM sync_meta WHERE country=?",arrayOf(scope.country)).use { c->buildSet { while(c.moveToNext())add(c.getString(0)) } }
            if(knownEpochs.isNotEmpty() && knownEpochs.any { it!=delta.epoch }) {
                require(delta.reset)
                db.delete("memberships","scope IN (SELECT scope FROM sync_meta WHERE country=?)",arrayOf(scope.country))
                db.delete("hazards","country=? AND layer='live'",arrayOf(scope.country))
                db.delete("versions","country=?",arrayOf(scope.country))
                db.delete("sync_meta","country=?",arrayOf(scope.country))
            }
            if(delta.reset)db.delete("memberships","scope=?",arrayOf(scope.key))
            delta.changes.forEach { change ->
                val version=db.rawQuery("SELECT revision FROM versions WHERE id=? AND country=?",arrayOf(change.id,scope.country)).use { if(it.moveToFirst())it.getLong(0) else -1L }
                if(change.sequence>=version) {
                    val hazard=change.hazard
                    if(hazard==null) {
                        db.delete("hazards","id=? AND country=? AND layer='live'",arrayOf(change.id,scope.country))
                    } else {
                        put(db,hazard,"live")
                        db.execSQL("INSERT OR IGNORE INTO memberships VALUES(?,?)",arrayOf(scope.key,change.id))
                    }
                    db.execSQL("INSERT OR REPLACE INTO versions VALUES(?,?,?)",arrayOf<Any>(change.id,scope.country,change.sequence))
                }
            }
            db.execSQL("INSERT OR REPLACE INTO sync_meta VALUES(?,?,?,?,?)",arrayOf<Any>(scope.key,scope.country,delta.epoch,delta.next,now))
            // Bound regional working-set storage. Deleting a membership must not remove shared rows.
            db.execSQL("DELETE FROM memberships WHERE scope IN (SELECT scope FROM sync_meta ORDER BY checked DESC LIMIT -1 OFFSET 32)")
            db.execSQL("DELETE FROM sync_meta WHERE scope IN (SELECT scope FROM sync_meta ORDER BY checked DESC LIMIT -1 OFFSET 32)")
            db.execSQL("DELETE FROM hazards WHERE layer='live' AND id NOT IN (SELECT id FROM memberships)")
            db.delete("hazards","expires<=?",arrayOf(now.toString()))
        }
    }
    private fun put(db: SQLiteDatabase, h: Hazard, layer: String) {
        val values=ContentValues().apply {
            put("id",h.id); put("country",h.country); put("kind",h.kind.name); put("lat",h.point.lat); put("lon",h.point.lon)
            if(h.heading==null)putNull("heading") else put("heading",h.heading)
            put("road",h.road); put("expires",h.expiresAt); put("demo",if(h.demo)1 else 0); put("revision",h.revision); put("layer",layer)
        }
        // UPDATE preserves memberships; REPLACE would fire ON DELETE CASCADE and lose other scopes.
        if(db.update("hazards",values,"id=?",arrayOf(h.id))==0)check(db.insert("hazards",null,values)!=-1L)
    }
    fun nearby(country: String, point: Point, now: Long, radius: Double=5000.0): List<Hazard> {
        require(country in COUNTRIES && point.valid())
        val dy=radius/110574; val dx=radius/(111320*max(.001,cos(Math.toRadians(point.lat))))
        return readableDatabase.rawQuery("SELECT id,country,kind,lat,lon,heading,road,expires,demo,revision FROM hazards WHERE country=? AND lat BETWEEN ? AND ? AND lon BETWEEN ? AND ? AND expires>?",arrayOf(country,(point.lat-dy).toString(),(point.lat+dy).toString(),(point.lon-dx).toString(),(point.lon+dx).toString(),now.toString())).use { c ->
            buildList { while(c.moveToNext())add(read(c)) }
        }
    }
    private fun read(c: SqlCursor)=Hazard(c.getString(0),c.getString(1),Kind.valueOf(c.getString(2)),Point(c.getDouble(3),c.getDouble(4)),if(c.isNull(5))null else c.getDouble(5),c.getString(6),c.getLong(7),c.getInt(8)==1,c.getLong(9))
    private inline fun transaction(db: SQLiteDatabase, block: ()->Unit) {
        db.beginTransaction()
        try { block(); db.setTransactionSuccessful() } finally { db.endTransaction() }
    }
}
