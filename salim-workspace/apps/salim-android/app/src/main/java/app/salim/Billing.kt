package app.salim

import android.app.Activity
import androidx.compose.foundation.background
import androidx.compose.foundation.heightIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Play Billing for the two Salim Premium subscriptions.
 *
 * The entitlement rule is the one written into the paywall: every camera and hazard warning
 * works without this, and nothing here can withhold one. Premium buys a history kept without
 * limit, and later the absence of advertising.
 *
 * Nothing is ever charged in a build with no products configured: Play returns no
 * ProductDetails, the dialog says so, and no button is offered.
 */
class Billing(private val activity: Activity) : PurchasesUpdatedListener {
    private val client = BillingClient.newBuilder(activity)
        .setListener(this)
        .enablePendingPurchases(
            PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()
        )
        .build()

    private val _premium = MutableStateFlow(false)
    val premium: StateFlow<Boolean> = _premium.asStateFlow()

    private val _plans = MutableStateFlow<List<ProductDetails>>(emptyList())
    val plans: StateFlow<List<ProductDetails>> = _plans.asStateFlow()

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()

    private val _unavailable = MutableStateFlow(false)
    val unavailable: StateFlow<Boolean> = _unavailable.asStateFlow()

    fun start() {
        client.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    queryPlans()
                    refreshEntitlement()
                } else {
                    _unavailable.value = true
                    _message.value = "Google Play billing is not available on this device."
                }
            }

            override fun onBillingServiceDisconnected() {
                _message.value = "Billing connection lost. Reopen Settings to reconnect."
            }
        })
    }

    fun close() {
        runCatching { client.endConnection() }
    }

    private fun queryPlans() {
        val products = listOf(MONTHLY, YEARLY).map { id ->
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(id)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        }
        val params = QueryProductDetailsParams.newBuilder().setProductList(products).build()
        client.queryProductDetailsAsync(params) { result, details ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                // Cheapest first, so the shorter commitment is never buried under the longer one.
                _plans.value = details.productDetailsList.orEmpty().sortedBy { priceMicros(it) }
                if (_plans.value.isEmpty()) {
                    _unavailable.value = true
                    _message.value = "No subscription is configured for this build yet."
                }
            } else {
                _unavailable.value = true
                _message.value = "Google Play could not be reached. Check your connection."
            }
        }
    }

    fun refreshEntitlement() {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()
        client.queryPurchasesAsync(params) { result, purchases ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                _premium.value = purchases.any { purchase ->
                    purchase.purchaseState == Purchase.PurchaseState.PURCHASED &&
                        purchase.products.any { it == MONTHLY || it == YEARLY }
                }
            }
        }
    }

    fun buy(details: ProductDetails) {
        val offer = details.subscriptionOfferDetails?.firstOrNull()
        if (offer == null) {
            _message.value = "This subscription has no offer available."
            return
        }
        val params = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(
                listOf(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(details)
                        .setOfferToken(offer.offerToken)
                        .build()
                )
            )
            .build()
        val result = client.launchBillingFlow(activity, params)
        if (result.responseCode != BillingClient.BillingResponseCode.OK) {
            _message.value = "The purchase screen could not open. Nothing was charged."
        }
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                purchases.orEmpty().forEach { acknowledge(it) }
                refreshEntitlement()
                _message.value = "Salim Premium is active."
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> _message.value = null
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                refreshEntitlement()
                _message.value = "This account already has Salim Premium."
            }
            else -> _message.value = "The purchase did not complete. Nothing was charged."
        }
    }

    /** A purchase that is not acknowledged within three days is refunded by Play. */
    private fun acknowledge(purchase: Purchase) {
        if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) return
        if (purchase.isAcknowledged) return
        val params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()
        client.acknowledgePurchase(params) { }
    }

    companion object {
        const val MONTHLY = "salim_premium_monthly"
        const val YEARLY = "salim_premium_yearly"

        /** The price of the first paying phase, in micros, for ordering the two plans. */
        fun priceMicros(details: ProductDetails): Long =
            details.subscriptionOfferDetails?.firstOrNull()
                ?.pricingPhases?.pricingPhaseList?.firstOrNull()?.priceAmountMicros ?: 0L

        fun period(details: ProductDetails): String {
            val phase = details.subscriptionOfferDetails?.firstOrNull()
                ?.pricingPhases?.pricingPhaseList?.firstOrNull() ?: return ""
            val days = phase.billingPeriodCount * when (phase.billingPeriod.uppercase()) {
                "P1D" -> 1
                "P1W" -> 7
                "P1M" -> 30
                "P1Y" -> 365
                else -> 0
            }
            return when {
                days <= 0 -> ""
                days <= 1 -> "per day"
                days <= 7 -> "per week"
                days <= 31 -> "per month"
                else -> "per year"
            }
        }
    }
}

/**
 * The one screen in the Android app that asks for money. It states the price, states what the
 * money buys, and says first — in the largest type here — what it never buys.
 */
@Composable
fun PremiumDialog(billing: Billing, onDismiss: () -> Unit) {
    val plans by billing.plans.collectAsStateWithLifecycle()
    val premium by billing.premium.collectAsStateWithLifecycle()
    val unavailable by billing.unavailable.collectAsStateWithLifecycle()
    val message by billing.message.collectAsStateWithLifecycle()
    val scheme = MaterialTheme.colorScheme

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Salim Premium", fontSize = 20.sp) },
        text = {
            Column(
                Modifier.heightIn(max = 460.dp).verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    "Every camera warning stays free. Speed cameras, seatbelt cameras, red lights, " +
                        "roadworks and congestion alerts are never held back from a driver who has not subscribed.",
                    fontSize = 13.sp,
                    lineHeight = 19.sp,
                    color = scheme.onSurface
                )
                Text(
                    "Premium keeps your trip history without limit. Advertising never appears on the " +
                        "drive screen in any version of Salim.",
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                    color = scheme.onSurfaceVariant
                )
                if (premium) {
                    Text("Active on this Google account.", fontSize = 13.sp, color = scheme.primary)
                } else if (plans.isEmpty()) {
                    Text(
                        if (unavailable) "Google Play has no subscription configured for this build, so nothing can be purchased here."
                        else "Loading plans…",
                        fontSize = 12.sp,
                        lineHeight = 18.sp,
                        color = scheme.onSurfaceVariant
                    )
                } else {
                    plans.forEach { details ->
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .background(scheme.surface, RoundedCornerShape(8.dp))
                                .border(1.dp, scheme.outline, RoundedCornerShape(8.dp))
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(details.name, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                                Text(
                                    Billing.period(details),
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = scheme.onSurfaceVariant
                                )
                            }
                            TextButton(onClick = { billing.buy(details) }) {
                                Text(details.subscriptionOfferDetails?.firstOrNull()
                                    ?.pricingPhases?.pricingPhaseList?.firstOrNull()?.formattedPrice ?: "",
                                    fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = scheme.primary)
                            }
                        }
                    }
                }
                message?.let {
                    Text(it, fontSize = 12.sp, color = scheme.onSurfaceVariant)
                }
                Text(
                    "Payment is taken by Google Play at confirmation and renews automatically unless " +
                        "cancelled at least 24 hours before the period ends. Cancel any time in Play Store " +
                        "→ Payments and subscriptions. Ending it never removes a warning from the road.",
                    fontSize = 11.sp,
                    lineHeight = 16.sp,
                    color = scheme.onSurfaceVariant
                )
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close") } }
    )
}
