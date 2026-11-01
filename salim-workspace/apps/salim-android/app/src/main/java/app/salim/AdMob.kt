package app.salim

import android.app.Activity
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.ConsentInformation
import com.google.android.ump.UserMessagingPlatform
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Consent gates all ad requests; UMP's privacy-options form remains available in Settings. */
object SalimAdConsent {
    private val mutableCanRequest = MutableStateFlow(false)
    val canRequestAds = mutableCanRequest.asStateFlow()
    private val mutablePrivacyOptions = MutableStateFlow(false)
    val privacyOptionsRequired = mutablePrivacyOptions.asStateFlow()
    private var requestInFlight = false
    private var adsStarted = false

    @Synchronized
    fun refresh(activity: Activity) {
        if (requestInFlight) return
        requestInFlight = true
        val info = UserMessagingPlatform.getConsentInformation(activity)
        val parameters = ConsentRequestParameters.Builder().build()

        fun finish() {
            requestInFlight = false
            mutablePrivacyOptions.value =
                info.privacyOptionsRequirementStatus == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
            val allowed = info.canRequestAds()
            mutableCanRequest.value = allowed
            if (allowed && !adsStarted) {
                adsStarted = true
                MobileAds.initialize(activity) { }
            }
        }

        info.requestConsentInfoUpdate(
            activity,
            parameters,
            {
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { finish() }
            },
            { finish() }
        )
    }

    fun showPrivacyOptions(activity: Activity) {
        UserMessagingPlatform.showPrivacyOptionsForm(activity) { error ->
            val info = UserMessagingPlatform.getConsentInformation(activity)
            mutablePrivacyOptions.value =
                info.privacyOptionsRequirementStatus == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
            mutableCanRequest.value = info.canRequestAds()
            if (error == null && mutableCanRequest.value && !adsStarted) {
                adsStarted = true
                MobileAds.initialize(activity) { }
            }
        }
    }
}

@Composable
fun SalimAdBanner(modifier: Modifier = Modifier) {
    val allowed by SalimAdConsent.canRequestAds.collectAsStateWithLifecycle()
    if (!BuildConfig.ADS_ENABLED || !allowed) return

    val context = LocalContext.current
    Box(modifier.fillMaxWidth().height(50.dp), contentAlignment = Alignment.Center) {
        AndroidView(
            modifier = Modifier.fillMaxWidth().height(50.dp),
            factory = { viewContext ->
                AdView(viewContext).apply {
                    setAdSize(AdSize.BANNER)
                    adUnitId = BuildConfig.ADMOB_BANNER_ID
                    loadAd(AdRequest.Builder().build())
                }
            },
            onRelease = { it.destroy() }
        )
    }
}
