package app.sahm.core
import org.junit.Test
import org.junit.Assert.*
class SyncTest {
    private val scope=Scope("BH",262,505)
    private val cursor=Cursor("epoch-a",10)
    @Test fun acceptsContiguousScopeDelta() { Delta(1,scope.key,"epoch-a",10,11,false,false,listOf(Change(11,"live:x",null))).validate(scope,cursor) }
    @Test fun resetCanChangeEpoch() { Delta(1,scope.key,"epoch-b",0,5,true,false,listOf(Change(5,"live:x",null))).validate(scope,cursor) }
    @Test fun rejectsWrongScopeEpochCursorAndNonProgressingPage() {
        val good=Delta(1,scope.key,"epoch-a",10,11,false,false,listOf(Change(11,"live:x",null)))
        for(bad in listOf(good.copy(scope="SA:262:505"),good.copy(epoch="other"),good.copy(from=9),good.copy(schemaVersion=2),good.copy(next=10,changes=emptyList(),hasMore=true),good.copy(changes=listOf(Change(11,"static:x",null))),good.copy(changes=listOf(Change(11,"live:x",null),Change(11,"live:y",null))))) {
            try { bad.validate(scope,cursor);fail("Expected malformed delta rejection") } catch(_:IllegalArgumentException) { }
        }
    }
    @Test fun retriesBackOffAndReset() { val gate=RetryGate();assertTrue(gate.ready(0));gate.failure(0,9999);assertEquals(13_000L,gate.nextAttempt);assertFalse(gate.ready(1000));repeat(20){gate.failure(1000,0)};assertEquals(301_000L,gate.nextAttempt);gate.success(10_000);assertEquals(0,gate.failures);assertEquals(40_000L,gate.nextAttempt) }
}
