import { initializeApp, getApps, FirebaseOptions, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

function getFirebaseConfig(): FirebaseOptions | null {
  const config: Partial<FirebaseOptions> = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const requiredKeys: Array<keyof FirebaseOptions> = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missing = requiredKeys.filter((k) => !config[k]);

  if (missing.length > 0) {
    // In development, don't crash the dev server — warn instead.
    const msg = `Missing Firebase env vars: ${missing.join(", ")}. Add them to .env.local (see .env.example).`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }
    // eslint-disable-next-line no-console
    console.warn(msg);
    return null;
  }

  return config as FirebaseOptions;
}

export function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseConfig();
  if (!config) return null;

  if (!getApps().length) {
    initializeApp(config);
  }
  return getApps()[0] ?? null;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}
