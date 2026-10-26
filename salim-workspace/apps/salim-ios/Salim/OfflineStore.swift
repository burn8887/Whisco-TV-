import Foundation
import SQLite3

/// Actor-confined SQLite for the disclosed local pack and on-device camera cache.
actor OfflineStore {
    private var db:OpaquePointer?
    private let transient=unsafeBitCast(-1,to:sqlite3_destructor_type.self)
    init(url:URL?=nil) throws {
        let directory=FileManager.default.urls(for:.applicationSupportDirectory,in:.userDomainMask)[0].appendingPathComponent("Salim",isDirectory:true)
        if url==nil {try FileManager.default.createDirectory(at:directory,withIntermediateDirectories:true);try FileManager.default.setAttributes([.protectionKey:FileProtectionType.completeUntilFirstUserAuthentication],ofItemAtPath:directory.path)}
        let path=url ?? directory.appendingPathComponent("offline.sqlite")
        guard sqlite3_open_v2(path.path,&db,SQLITE_OPEN_CREATE|SQLITE_OPEN_READWRITE|SQLITE_OPEN_FULLMUTEX,nil)==SQLITE_OK else {throw URLError(.cannotOpenFile)}
        let schema="PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS hazards(id TEXT PRIMARY KEY,country TEXT NOT NULL,lat REAL NOT NULL,lon REAL NOT NULL,expires REAL NOT NULL,payload BLOB NOT NULL);CREATE INDEX IF NOT EXISTS hazards_bbox ON hazards(country,lat,lon);PRAGMA user_version=1;"
        guard sqlite3_exec(db,schema,nil,nil,nil)==SQLITE_OK else {throw URLError(.cannotCreateFile)}
    }
    deinit {sqlite3_close(db)}
    private func exec(_ sql:String) throws {guard sqlite3_exec(db,sql,nil,nil,nil)==SQLITE_OK else {throw URLError(.cannotWriteToFile)}}
    func removeSyntheticDemoRows() throws {
        try exec("DELETE FROM hazards WHERE id LIKE 'static:demo-%'")
    }
    func seed(_ hazards:[Hazard]) throws {
        for h in hazards {try h.validate()}
        try exec("BEGIN IMMEDIATE")
        do {
            for h in hazards {
                var stmt:OpaquePointer?
                guard sqlite3_prepare_v2(db,"INSERT OR IGNORE INTO hazards VALUES(?,?,?,?,?,?)",-1,&stmt,nil)==SQLITE_OK else {throw URLError(.cannotWriteToFile)}
                defer {sqlite3_finalize(stmt)}
                sqlite3_bind_text(stmt,1,h.id,-1,transient);sqlite3_bind_text(stmt,2,h.country,-1,transient)
                sqlite3_bind_double(stmt,3,h.point.lat);sqlite3_bind_double(stmt,4,h.point.lon);sqlite3_bind_double(stmt,5,h.expiresAt)
                let data=try JSONEncoder().encode(h)
                _=data.withUnsafeBytes {sqlite3_bind_blob(stmt,6,$0.baseAddress,Int32(data.count),transient)}
                guard sqlite3_step(stmt)==SQLITE_DONE else {throw URLError(.cannotWriteToFile)}
            }
            try exec("COMMIT")
        } catch {try? exec("ROLLBACK");throw error}
    }
    func nearby(country:String,point:Point,now:Double) throws -> [Hazard] {
        guard DemoData.countries.contains(country),point.valid else {throw URLError(.badURL)}
        let dy=5000.0/110574,dx=5000.0/(111320*max(0.001,cos(point.lat * .pi/180)))
        var stmt:OpaquePointer?
        guard sqlite3_prepare_v2(db,"SELECT payload FROM hazards WHERE country=? AND lat BETWEEN ? AND ? AND lon BETWEEN ? AND ? AND expires>?",-1,&stmt,nil)==SQLITE_OK else {throw URLError(.cannotParseResponse)}
        defer {sqlite3_finalize(stmt)}
        sqlite3_bind_text(stmt,1,country,-1,transient);sqlite3_bind_double(stmt,2,point.lat-dy);sqlite3_bind_double(stmt,3,point.lat+dy);sqlite3_bind_double(stmt,4,point.lon-dx);sqlite3_bind_double(stmt,5,point.lon+dx);sqlite3_bind_double(stmt,6,now)
        var result:[Hazard]=[]
        var step=sqlite3_step(stmt)
        while step==SQLITE_ROW {
            guard let bytes=sqlite3_column_blob(stmt,0) else {throw URLError(.cannotParseResponse)}
            let data=Data(bytes:bytes,count:Int(sqlite3_column_bytes(stmt,0)))
            let hazard=try JSONDecoder().decode(Hazard.self,from:data);try hazard.validate();result.append(hazard)
            step=sqlite3_step(stmt)
        }
        guard step==SQLITE_DONE else {throw URLError(.cannotParseResponse)}
        return result
    }
}
