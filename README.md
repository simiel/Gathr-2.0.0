# Gathr 2.0

Gathr is a cross-platform mobile client for people who want to collaborate, talk, and take part in purposeful exchanges with others who share their schools, faith, industries, or neighborhoods. The product is Ghana-first: phone entry defaults to Ghana, the education step lists Ghanaian secondary schools and universities, and the get-started screen opens the privacy policy and terms on [gathr.online](https://www.gathr.online). This repository is that Expo app.

## Project status

Active and in progress. `master` is the configured application shell: Expo Router, NativeWind, Sentry, and light/dark theme support, with the stock template screens reduced to two placeholders. Splash, onboarding, phone authentication, profile setup, and preference capture are implemented on [`feature/authentication&UserSetup`](https://github.com/simiel/Gathr-2.0.0/tree/feature/authentication%26UserSetup), which continues directly from the current `master` tip. After sign-in, the home experience is still a stub: one tab renders the label `MESSAGING`, and the other signs the user out. The third onboarding slide describes transactions; the repository has no transaction screen or payment code.

## Key features

**On `master`**

- File-based navigation with a root stack and two tabs, Home and Explore.
- Light and dark palettes, plus a web color-scheme hook that waits for client hydration so static rendering stays consistent.
- Splash screen held until the SpaceMono font has loaded.
- Sentry connected through the Expo config plugin (organization `gathr-ml`, project `gathr`) and the Metro config.

**On `feature/authentication&UserSetup`**

- Animated splash, a three-slide onboarding carousel (collaboration, conversation, and transactions), and a get-started screen that links to `https://www.gathr.online/privacy-policy` and `https://www.gathr.online/terms`.
- First-launch routing with AsyncStorage (`hasLaunched`): splash on the first open, get-started on later opens, and profile setup once Clerk reports a signed-in user.
- Phone sign-in and sign-up with Clerk. A country picker (Ghana and the United States preferred), `libphonenumber-js` validation, a six-digit OTP with a 30-second resend cooldown, and Clerk API error handling.
- After verification, a Clerk JWT from the `integration_firebase` template is exchanged for a Firebase Auth session with `signInWithCustomToken`.
- Clerk session tokens cached in Expo SecureStore.
- Profile form for first name, last name, username, and an optional photo. Usernames are checked live against Firestore and must start with a letter and contain only lowercase letters and numbers. Photos are chosen from the library, with a permission prompt and an approximate 1 MB size guard, and stored as base64.
- Preference wizard in a bottom sheet: education, faith, industry (three to five choices), and up to five free-text locations, validated with Zod. The wizard can be skipped. Profiles and preferences are merged into the Firestore collection `users-test`, keyed by the Clerk user id.
- Route groups that separate onboarding, auth, user setup, and the signed-in tabs, and send unsigned users back to get-started.
- Jest suites for root routing, the auth screen, the onboarding screen, and the test setup.

## Tech stack

| Area | `master` | Added on the feature branch |
| --- | --- | --- |
| Runtime | Expo SDK 52, React Native 0.76.6, React 18.3, TypeScript in strict mode | Same |
| Navigation | Expo Router 4, React Navigation 7, typed routes | Route groups for onboarding, auth, user setup, and main |
| UI | NativeWind 4, Tailwind CSS 3 | Lato, Lottie, Reanimated, Gorhom bottom sheets, Iconsax, `expo-linear-gradient` |
| Targets | iOS (tablet supported), Android, and static web via Metro. Portrait. React Native New Architecture enabled | Display name **Gathr Online**, Android package `com.simiel.Gathr`, URL scheme `gathr` |
| Identity and data | — | Clerk, Firebase Auth, Cloud Firestore, Zod, React Hook Form |
| Monitoring | `@sentry/react-native` | Same |
| Tests | Jest with the `jest-expo` preset | Testing Library, plus `test:watch` and `test:coverage` scripts |
| Release config | — | `eas.json` profiles `preview`, `preview2`, `preview3`, `preview4`, and `production` |

On `master` the Expo name is **Gathr-2.0** (slug `Gathr-2.0`, URL scheme `myapp`). `ios/` and `android/` are gitignored; native projects are produced by Expo rather than committed.

## Architecture

`master` layout:

```text
app/
  _layout.tsx           Root stack, font load, splash, Sentry, theme
  global.css            Tailwind entry
  (tabs)/               Home and Explore placeholders
assets/                 Icon, splash, SpaceMono
constants/Colors.ts     Light and dark palette
hooks/                  useColorScheme, web hydration variant, useThemeColor
scripts/reset-project.js
```

Metro uses `getSentryExpoConfig` and NativeWind with `app/global.css` as the CSS input. Babel runs `babel-preset-expo` with NativeWind as the JSX import source. TypeScript maps `@/*` to the repository root. `app.json` sets `newArchEnabled` and `typedRoutes`.

The feature branch keeps that foundation and adds route groups plus the modules below.

```text
app/(onboarding)/       Splash, carousel, get-started
app/(auth)/             Phone entry and OTP
app/(user-setup)/       Profile form, welcome preview, preferences
app/(main)/             Signed-in tabs
components/             Onboarding controls and preference steps
config/firebase.ts      Firebase app, Auth, and Firestore
hooks/useAppBootstrap.ts    Fonts, AsyncStorage, media permissions, then hide splash
hooks/useUserProfile.ts     Read and write users-test
hooks/useOnboardingForm.tsx Step model and Zod schemas
utils/clerk.ts          SecureStore token cache
utils/permissions.ts    Camera and photo-library permission requests
__tests__/              Layout, auth, and onboarding suites
eas.json                Expo Application Services build profiles
```

`useOnboardingForm` holds the Ghana school and university lists, faith denominations, and the industry options used by the preference steps.

## Getting started

Prerequisites: Node.js 18 or newer (Expo SDK 52), Yarn 1 (the lockfile is Yarn v1), and a way to run the app — Expo Go, an Android emulator, or the iOS Simulator.

```bash
yarn
yarn start
```

Scripts defined in `package.json` on this branch:

| Command | Runs |
| --- | --- |
| `yarn android` | `expo start --android` |
| `yarn ios` | `expo start --ios` |
| `yarn web` | `expo start --web` |
| `yarn test` | `jest --watchAll` |
| `yarn lint` | `expo lint` |

This branch starts without environment variables. Sentry is initialized in `app/_layout.tsx`.

`yarn reset-project` is the Expo template reset. It moves `app`, `components`, `hooks`, `constants`, and `scripts` into `app-example` and writes a blank `app/`. Run it only when you want that blank slate.

### Feature branch

```bash
git checkout 'feature/authentication&UserSetup'
yarn
```

Firebase reads these variables in `config/firebase.ts`. Supply values locally (`.env` and `.env.local` are gitignored). No secret values belong in the repo:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Clerk is initialized in `app/_layout.tsx` on that branch. Its scripts are `yarn start`, `yarn android`, `yarn ios`, `yarn web`, `yarn test` (`jest`), `yarn test:watch`, `yarn test:coverage`, and `yarn lint`.

## What this demonstrates

The client is carried from an Expo scaffold to a working signed-out journey and identity model. `master` already makes specific platform choices: the New Architecture, typed routes, NativeWind through both Metro and Babel, Sentry’s Expo Metro config, and a color-scheme hook that is safe for static web rendering. The feature branch builds a complete pre-home flow — animated splash, paged onboarding, phone OTP, and guarded route groups — and joins two auth systems by exchanging a Clerk Firebase-template JWT for a Firebase session. Profile data lives in Firestore, with a debounced username check, and the preference wizard combines React Hook Form, Zod, bottom sheets, and Lottie. Root routing is covered with Jest and Testing Library.
