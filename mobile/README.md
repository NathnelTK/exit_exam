# Exit Planner Mobile (React Native / Expo)

## Run (development)

```bash
cd mobile
npm install
npm run start
```

- Android: `npm run android` (requires Android SDK)
- iOS: `npm run ios` (on macOS with Xcode)

The app expects the backend at `http://localhost:5000`. On a device/emulator, change to your machine IP (e.g., `http://192.168.1.10:5000`).

## Build an APK

You have two options: Local Gradle build (debug/release) or EAS Cloud build (signed APK for testing).

### Option A: Local APK with Gradle (no Expo account needed)

Prereqs:
- Android Studio + Android SDK + JDK 17 (or 11)
- ANDROID_HOME set (optional if building via Android Studio)

Steps:
1) Prebuild native Android project and install deps
```bash
cd mobile
npm install
npx expo prebuild --platform android
```
This creates `mobile/android/`.

2) Build a debug APK from CLI
```bash
cd android
./gradlew assembleDebug   # on Windows: gradlew.bat assembleDebug
```
APK path: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

3) Optional: Build a release APK
- Create a keystore (Android Studio > Build > Generate Signed Bundle/APK or via keytool)
- Configure signing in `android/app/build.gradle`
- Then run:
```bash
./gradlew assembleRelease
```
APK path: `mobile/android/app/build/outputs/apk/release/app-release.apk`

Open `mobile/android` in Android Studio if you prefer GUI: Build > Build Bundle(s)/APK(s) > Build APK(s).

### Option B: EAS Cloud Build (fast APK for testing)

Prereqs:
- Expo account (free)
- Install EAS CLI: `npm i -g eas-cli`

Steps:
1) Login & configure
```bash
cd mobile
eas login
```

2) Build an APK using the `preview` profile (configured in `eas.json`)
```bash
eas build --platform android --profile preview
```
This produces an unsigned APK link you can download from the Expo dashboard (or CLI output). For production releases, use `--profile production` (AAB by default).

Notes:
- `mobile/eas.json` has `preview` set to buildType `apk`.
- Set env for API: edit `eas.json` or use EAS Secrets.

## Screens
- Dashboard (hourglass stopwatch UI)
- Settings
- Uploads (PDF/images) -> `POST /api/materials`
- Weekly Plan (generate) -> `POST /api/weekly-plans/generate`
- Mock Exam (generate) -> `POST /api/mock-exams/generate`

## Backend
- Start the API from project root:
```bash
npm run server
```
Default: `http://localhost:5000`

If running the app on a device/emulator:
- Replace `localhost` with your machine IP in API calls in mobile screens or inject via env (e.g., EAS env var `API_BASE_URL`).

## Troubleshooting
- Emulator cannot reach API: use your LAN IP, ensure firewall allows inbound, and device/emulator is on same network.
- SDK errors on build: open `mobile/android` in Android Studio and let it sync Gradle/SDK.
- Debug build works but release fails: check signing config and minSdk/compileSdk versions.

