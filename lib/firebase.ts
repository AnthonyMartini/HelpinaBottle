import * as admin from 'firebase-admin';

function getFirebaseConfig() {
  // Option 1: Full JSON string from environment (preferred for CI/CD like Amplify)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
    }
  }

  // Option 2: Individual environment variables
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

if (!admin.apps.length) {
  const config = getFirebaseConfig();
  if (config) {
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
  } else {
    console.warn('Firebase initialized without cloud credentials. Using local defaults if available.');
  }
}

export const adminDb = admin.firestore();
