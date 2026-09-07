-keepattributes *Annotation*, InnerClasses, Signature, Exception
-keep class tv.whisco.app.** { *; }
-keep class kotlinx.serialization.** { *; }
-keepclassmembers class ** {
    @kotlinx.serialization.SerialName <fields>;
}
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.codehaus.mojo.animal_sniffer.**
-keep class androidx.media3.** { *; }
