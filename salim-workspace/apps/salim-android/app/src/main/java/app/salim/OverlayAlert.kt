package app.salim

import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.Gravity
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import app.salim.core.AlertMatch

/**
 * Premium: the camera alert floats over Google Maps, Waze or any other app while Salim runs
 * in the background — a compact card with the camera type, a live distance countdown and the
 * posted limit. Uses Android's "display over other apps" permission, which the driver grants
 * once from Settings. Hidden whenever Salim itself is on screen.
 */
object OverlayAlert {
    @Volatile var appVisible = false
    private var card: LinearLayout? = null
    private var distance: TextView? = null
    private val main = Handler(Looper.getMainLooper())

    fun canDraw(context: Context) = Settings.canDrawOverlays(context)

    fun permissionIntent(context: Context) =
        Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    private fun allowed(context: Context): Boolean {
        val s = DriveStore.state.value
        return s.premium && AlertPrefs.options.value.overlay && !appVisible && canDraw(context)
    }

    fun show(context: Context, match: AlertMatch) = main.post {
        if (!allowed(context)) return@post
        hideNow(context)
        val dp = context.resources.displayMetrics.density
        val title = TextView(context).apply {
            text = Ar.t(match.hazard.title).uppercase(); setTextColor(0xFFFFC24B.toInt()); textSize = 12f
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD); letterSpacing = if (Ar.enabled) 0f else 0.12f
        }
        val meters = TextView(context).apply {
            text = "${match.meters.toInt()} m"; setTextColor(0xFFE9F1EA.toInt()); textSize = 30f
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        }
        val road = TextView(context).apply {
            text = listOfNotNull(match.hazard.road, match.hazard.limit?.let { "${Ar.t("Limit")} $it" }).joinToString(" · ")
            setTextColor(0xFF94A79B.toInt()); textSize = 12f; maxLines = 1
        }
        val box = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding((16 * dp).toInt(), (12 * dp).toInt(), (16 * dp).toInt(), (12 * dp).toInt())
            background = GradientDrawable().apply {
                setColor(0xF2121715.toInt()); cornerRadius = 10 * dp; setStroke((2 * dp).toInt(), 0xFFFFC24B.toInt())
            }
            addView(title); addView(meters); addView(road)
            setOnClickListener { hideNow(context) }
        }
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL; y = (72 * dp).toInt() }
        runCatching { context.getSystemService(WindowManager::class.java).addView(box, params); card = box; distance = meters }
    }

    /** Live countdown on the floating card. */
    fun update(meters: Double) = main.post {
        distance?.text = "${meters.toInt()} m"
        if (meters <= 60) distance?.setTextColor(0xFFFF6B5A.toInt())
    }

    fun hide(context: Context) = main.post { hideNow(context) }

    private fun hideNow(context: Context) {
        card?.let { v -> runCatching { context.getSystemService(WindowManager::class.java).removeView(v) } }
        card = null; distance = null
    }

}
