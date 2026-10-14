plugins { id("com.android.application"); kotlin("android"); id("org.jetbrains.kotlin.plugin.compose") }
val signingKeys = listOf("SAHM_ANDROID_KEYSTORE_PATH", "SAHM_ANDROID_KEYSTORE_PASSWORD", "SAHM_ANDROID_KEY_ALIAS", "SAHM_ANDROID_KEY_PASSWORD")
val signingValues = signingKeys.associateWith { System.getenv(it).orEmpty() }
val hasSigning = signingValues.values.any { it.isNotBlank() }
if (hasSigning) {
    require(signingValues.values.all { it.isNotBlank() }) { "Supply all four Sahm signing environment variables; partial signing configuration is refused." }
    require(file(signingValues.getValue("SAHM_ANDROID_KEYSTORE_PATH")).isFile) { "Sahm keystore file is unavailable." }
}
tasks.register("verifyReleaseSigning") {
    doLast { check(hasSigning) { "Unsigned demo build only. Configure a dedicated Sahm upload key before store distribution." } }
}
android {
    namespace = "app.sahm"
    compileSdk = 36
    defaultConfig {
        applicationId = "app.sahm.android.demo"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "0.2.0-demo"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("String", "FEED_URL", "\"\"")
    }
    buildFeatures { compose = true; buildConfig = true }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    signingConfigs {
        if (hasSigning) create("sahmRelease") {
            storeFile = file(signingValues.getValue("SAHM_ANDROID_KEYSTORE_PATH"))
            storePassword = signingValues.getValue("SAHM_ANDROID_KEYSTORE_PASSWORD")
            keyAlias = signingValues.getValue("SAHM_ANDROID_KEY_ALIAS")
            keyPassword = signingValues.getValue("SAHM_ANDROID_KEY_PASSWORD")
        }
    }
    buildTypes { release {
        isMinifyEnabled = false
        if (hasSigning) signingConfig = signingConfigs.getByName("sahmRelease")
    } }
    packaging { resources.excludes += "/META-INF/{AL2.0,LGPL2.1}" }
}
kotlin { jvmToolchain(17) }
dependencies {
    implementation(project(":core"))
    implementation(platform("androidx.compose:compose-bom:2025.10.01"))
    implementation("androidx.activity:activity-compose:1.11.0")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.9.4")
    implementation("androidx.core:core-ktx:1.17.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")
    androidTestImplementation("androidx.test:runner:1.6.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test:core:1.6.1")
}
