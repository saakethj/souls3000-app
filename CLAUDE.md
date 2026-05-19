@AGENTS.md

# S.O.U.L.S — React Native App

Private couple's digital memory vault. Mobile replica of souls3000.space.

## Stack

- Expo SDK 54 (blank TypeScript template)
- React Navigation v7 (native stack)
- expo-auth-session v7 (Google OAuth — no useProxy)
- expo-secure-store (JWT storage)
- expo-linear-gradient (sign-in screen only)
- react-native-svg (inline multi-color icons)
- react-native-reanimated (required by native-stack v7)

## Backend

Next.js + Supabase at `https://souls3000.space`. **Do not change web behavior.**

Mobile auth bridge: `POST /api/auth/mobile` — accepts Google `idToken`, returns a signed 30-day JWT.

**Auth header:** All API calls attach `X-Auth-Token: <jwt>` via `src/lib/api.ts`. We do NOT use `Authorization: Bearer` because Vercel strips the `Authorization` header on this project's deployment (OIDC/deployment-protection intercepts it). The web `validateSession()` reads both `authorization` (Bearer) and `x-auth-token` so web behavior is unchanged.

**Images:** Stored in private Supabase bucket `souls-3000-media` (path prefix `intro/`). The mobile app does NOT bundle them. It fetches short-lived signed URLs from `GET /api/home-images` (1-hour TTL, 50-min server cache). Bundling would leak originals via APK extraction.

## Project Structure

```
App.tsx                          — root: SafeAreaProvider → AuthProvider → NavigationContainer
src/
  context/AuthContext.tsx        — token state, signIn/signOut, SecureStore persistence
  lib/api.ts                     — apiGet/apiPost helpers; attaches X-Auth-Token
  navigation/AppNavigator.tsx    — shows SignIn if no token, Home if authenticated
  screens/
    SignInScreen.tsx             — Google OAuth → /api/auth/mobile → store JWT
    HomeScreen.tsx               — pure black bg; composes Home sections + sign-out
  components/
    Hero.tsx                     — Home: title + subtext + Ember & Wade signed-URL image + intro copy
```

## Auth Flow

1. User taps "Sign In with Google"
2. `expo-auth-session` opens Google consent → returns `id_token`
3. App POSTs `id_token` to `https://souls3000.space/api/auth/mobile`
4. Backend verifies with Google, checks `OAUTH_ALLOWED_EMAIL`, returns signed JWT
5. JWT stored in SecureStore; subsequent API calls send it as `X-Auth-Token`

## Environment Variables (.env — not committed)

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
```

## Android Build Notes

- Package name: `com.saakethj.soulsapp`
- Must use `npx expo run:android` (development build), NOT Expo Go
- `app.json` `scheme` must include `com.saakethj.soulsapp` so the OAuth redirect (`com.saakethj.soulsapp:/oauthredirect`) routes back to the app — without it the browser stays on google.com after consent
- Requires `JAVA_HOME` pointing to Android Studio JBR: `C:\Program Files\Android\Android Studio\jbr`
- Requires `ANDROID_HOME`: `C:\Users\saake\AppData\Local\Android\Sdk`
- Windows long path support must be enabled (`LongPathsEnabled = 1` in registry)
- Project must live at a short path (e.g. `C:\Dev\souls3000-app`) to avoid MAX_PATH errors in CMake

## Screens Plan

Build page by page. User provides screenshot before each section. Docs are updated after each section is confirmed working.

| Screen | Status |
|--------|--------|
| Sign In | Done |
| Home — Hero | Done |
| Home — Countdown | Not started |
| Home — Letters / remaining sections | Not started |
| Gallery | Not started |
| Journal | Not started |
| Crafts | Not started |
| Travel | Not started |

## Design Tokens

- App background: pure `#000` (matches web — no orange gradient on Home)
- Sign-in screen gradient: `['#1a0d05', '#0a0503', '#050505']` (kept only here)
- Primary text: `#f5e9d6`
- Muted text: `rgba(245, 233, 214, 0.5–0.7)`
- Heading gold: `#E8C99A`
- Accent / labels: `#C8846A`
- Error: `#C8846A`
- Fonts: system only — SF Pro on iOS (`System`), Roboto on Android (`Roboto` / `Roboto-Medium`). No custom/Google fonts.
