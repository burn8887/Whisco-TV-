package tv.whisco.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LiveTv
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.VideoLibrary
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController

@Composable
fun AppRoot() {
    val nav = rememberNavController()
    val store = remember { LocalStore() }
    val ctx = LocalContext.current
    LaunchedEffect(Unit) { store.load(ctx) }
    val route = nav.currentBackStackEntryAsState().value?.destination?.route
    val hideBar = route?.startsWith("watch") == true ||
        route?.startsWith("title") == true ||
        route?.startsWith("hub") == true ||
        route == "cast" ||
        route == "search"

    if (!store.ready) {
        Box(Modifier.fillMaxSize().background(Bg), contentAlignment = Alignment.Center) {
            Text("Whisco", color = Accent, style = MaterialTheme.typography.headlineLarge)
        }
        return
    }

    if (!store.onboarded) {
        OnboardingScreen(store) {}
        return
    }

    Scaffold(
        containerColor = Bg,
        bottomBar = {
            if (!hideBar) {
                NavigationBar(containerColor = SurfaceCol) {
                    data class Tab(val r: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)
                    listOf(
                        Tab("tonight", "Tonight", Icons.Filled.Home),
                        Tab("live", "Live", Icons.Filled.LiveTv),
                        Tab("library", "Library", Icons.Filled.VideoLibrary),
                        Tab("you", "You", Icons.Filled.Person),
                    ).forEach { tab ->
                        NavigationBarItem(
                            selected = route == tab.r,
                            onClick = {
                                nav.navigate(tab.r) {
                                    popUpTo("tonight") { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            label = { Text(tab.label) },
                            icon = { Icon(tab.icon, tab.label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Fg,
                                selectedTextColor = Fg,
                                unselectedIconColor = Muted,
                                unselectedTextColor = Muted,
                                indicatorColor = Elevated,
                            ),
                        )
                    }
                }
            }
        },
    ) { pad ->
        NavHost(nav, startDestination = "tonight", modifier = Modifier.padding(pad)) {
            composable("tonight") { HomeScreen(nav, store) }
            composable("live") { LiveScreen(nav, store) }
            composable("library") { LibraryScreen(nav, store) }
            composable("you") { YouScreen(nav, store) }
            composable("search") { SearchScreen(nav, store) }
            composable("cast") { CastScreen(nav, store) }
            composable("hub/{lang}") { back ->
                HubScreen(back.arguments?.getString("lang").orEmpty(), nav, store)
            }
            composable("title/{slug}") { back ->
                TitleScreen(back.arguments?.getString("slug").orEmpty(), nav, store)
            }
            composable("watchLive/{id}") { back ->
                WatchLiveScreen(back.arguments?.getString("id").orEmpty(), store, nav)
            }
            composable("watchYt/{id}") { back ->
                WatchYouTubeScreen(back.arguments?.getString("id").orEmpty())
            }
            composable("watchHls/{b64}") { back ->
                WatchHlsScreen(back.arguments?.getString("b64").orEmpty())
            }
        }
    }
}
