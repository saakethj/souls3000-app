# S.O.U.L.S

Private couple's digital memory vault — mobile app for souls3000.space.

Built with Expo (React Native). Android only for now.

## Setup

```bash
npm install
```

Create `.env` in the project root:

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
```

## Running

```bash
npx expo run:android
```

> Requires Android Studio, Java (JAVA_HOME set to Android Studio JBR), and a short project path on Windows (e.g. `C:\Dev\souls-app`) to avoid MAX_PATH errors.

## Notes

- Uses a development build — Expo Go will not work (Google OAuth requires the real package name `com.saakethj.soulsapp`)
- Auth is handled via a custom JWT bridge on the backend (`/api/auth/mobile`)
- All API calls hit `https://souls3000.space`
