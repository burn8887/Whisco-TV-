package app.salim
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import android.content.Context
import app.salim.core.*
import org.junit.*
import org.junit.Assert.*
import org.junit.runner.RunWith
@RunWith(AndroidJUnit4::class)
class HazardDatabaseTest {
    private val context=ApplicationProvider.getApplicationContext<Context>()
    private lateinit var db: HazardDatabase
    private val now=1_800_000_000_000L
    private val scope=Scope("BH",262,505)
    private fun hazard(seq: Long)=Hazard("live:x","BH",Kind.HAZARD,DemoData.center,null,"Test road",now+3600_000,true,seq)
    private fun delta(seq: Long,h: Hazard?,reset: Boolean=false,epoch: String="a",from: Long=0)=Delta(1,scope.key,epoch,from,seq,reset,false,listOf(Change(seq,"live:x",h)))
    @Before fun setup() { context.deleteDatabase("test-hazards.db");db=HazardDatabase(context,"test-hazards.db");db.seed("BH",1,DemoData.hazards) }
    @After fun cleanup() { db.close();context.deleteDatabase("test-hazards.db") }
    @Test fun offlineSeedSurvivesReopen() { assertEquals(4,db.nearby("BH",DemoData.center,now).size);db.close();db=HazardDatabase(context,"test-hazards.db");assertEquals(4,db.nearby("BH",DemoData.center,now).size) }
    @Test fun malformedDeltaCannotAdvanceCursor() { db.apply(scope,delta(1,hazard(1),true),now);try{db.apply(scope,delta(3,hazard(3),from=2),now);fail()}catch(_:IllegalArgumentException){};assertEquals(1L,db.cursor(scope).value);assertEquals(1L,db.nearby("BH",DemoData.center,now).first{it.id=="live:x"}.revision) }
    @Test fun upsertDeleteAndNoResurrection() { db.apply(scope,delta(1,hazard(1),true),now);db.apply(scope,delta(2,null,from=1),now);assertFalse(db.nearby("BH",DemoData.center,now).any{it.id=="live:x"});val other=Scope("BH",263,505);db.apply(other,Delta(1,other.key,"a",0,1,true,false,listOf(Change(1,"live:x",hazard(1)))),now);assertFalse(db.nearby("BH",DemoData.center,now).any{it.id=="live:x"}) }
    @Test fun epochResetRetainsStaticRows() { db.apply(scope,delta(10,hazard(10),true),now);db.apply(scope,delta(1,hazard(1),true,epoch="b"),now);assertEquals("b",db.cursor(scope).epoch);assertEquals(5,db.nearby("BH",DemoData.center,now).size) }
    @Test fun snapshotsRemoveMissingScopedRecords() { db.apply(scope,delta(1,hazard(1),true),now);db.apply(scope,Delta(1,scope.key,"a",0,2,true,false,emptyList()),now);assertEquals(4,db.nearby("BH",DemoData.center,now).size) }
    @Test fun olderExpiryIsNeverReturned() { db.apply(scope,delta(1,hazard(1).copy(expiresAt=now-1),true),now);assertEquals(4,db.nearby("BH",DemoData.center,now).size) }
}
