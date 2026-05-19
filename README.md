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

> Requires Android Studio, Java (JAVA_HOME set to Android Studio JBR), and a short project path on Windows (e.g. `C:\Dev\souls3000-app`) to avoid MAX_PATH errors.

## Progress

- [x] Sign In (Google OAuth → JWT bridge)
- [x] Home — Hero section (signed-URL image + intro copy, pure black background)
- [x] Home — Countdown (live timer + rotating phrase)
- [ ] Home — remaining sections
- [ ] Gallery / Journal / Crafts / Travel

## Notes

- Uses a development build — Expo Go will not work (Google OAuth requires the real package name `com.saakethj.soulsapp`)
- Auth is handled via a custom JWT bridge on the backend (`/api/auth/mobile`)
- API calls send the JWT as `X-Auth-Token` (Vercel strips `Authorization` on this deployment)
- Images are fetched as short-lived Supabase signed URLs via `/api/home-images` — never bundled in the APK
- All API calls hit `https://souls3000.space`
