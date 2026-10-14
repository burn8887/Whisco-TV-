package app.sahm

import android.Manifest
import android.content.pm.PackageManager
import androidx.lifecycle.Lifecycle
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import android.content.Context
import org.junit.*
import org.junit.Assert.*
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DriveLifecycleTest {
    private val instrumentation=InstrumentationRegistry.getInstrumentation()
    private fun main(block:()->Unit)=instrumentation.runOnMainSync(block)
    @Before fun prepare() { main {DriveStore.initialize(ApplicationProvider.getApplicationContext());DriveStore.end();DriveStore.country("BH");DriveStore.setVoice(false);DriveStore.clearTrips()} }
    @After fun finish() { main {DriveStore.end();DriveStore.clearTrips()} }
    @Test fun simulationNeedsNoLocationPermissionAndEndClearsActiveState() {
        val context=ApplicationProvider.getApplicationContext<Context>()
        assertEquals(PackageManager.PERMISSION_DENIED,context.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION))
        main {DriveStore.begin(Mode.DEMO);assertEquals(Mode.DEMO,DriveStore.state.value.mode);assertNotNull(DriveStore.state.value.fix);DriveStore.end();assertEquals(Mode.IDLE,DriveStore.state.value.mode);assertNull(DriveStore.state.value.fix);assertNull(DriveStore.state.value.average);assertNull(DriveStore.state.value.warning);assertEquals(1,DriveStore.state.value.trips.size)}
    }
    @Test fun backgroundingStopsSimulation() {
        ActivityScenario.launch(MainActivity::class.java).use { scenario ->
            scenario.onActivity {DriveStore.begin(Mode.DEMO)}
            scenario.moveToState(Lifecycle.State.CREATED)
            main {assertEquals(Mode.IDLE,DriveStore.state.value.mode);assertEquals(1,DriveStore.state.value.trips.size)}
        }
    }
    @Test fun recreationDoesNotDuplicateOrStopDemoSession() {
        ActivityScenario.launch(MainActivity::class.java).use { scenario ->
            scenario.onActivity {DriveStore.begin(Mode.DEMO)}
            scenario.recreate()
            scenario.onActivity {assertEquals(Mode.DEMO,DriveStore.state.value.mode);assertTrue(DriveStore.state.value.trips.isEmpty());DriveStore.end()}
        }
    }
    @Test fun activeSessionCannotChangeCountryOrCreateReports() {
        main {val count=DriveStore.state.value.drafts.size;DriveStore.begin(Mode.DEMO);DriveStore.country("SA");DriveStore.draft("Test road","Road hazard");assertEquals("BH",DriveStore.state.value.country);assertEquals(count,DriveStore.state.value.drafts.size);DriveStore.end()}
    }
}
