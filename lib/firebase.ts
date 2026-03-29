import * as admin from 'firebase-admin';

function getFirebaseConfig() {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccount) {
    // Strip surrounding single or double quotes if present
    if ((serviceAccount.startsWith("'") && serviceAccount.endsWith("'")) || 
        (serviceAccount.startsWith('"') && serviceAccount.endsWith('"'))) {
      serviceAccount = serviceAccount.slice(1, -1);
    }

    try {
      return JSON.parse(serviceAccount);
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

const config = getFirebaseConfig();

if (!admin.apps.length && config) {
  admin.initializeApp({
    credential: admin.credential.cert(config),
  });
}

// Export adminDb, but it will only be usable if initializeApp was called
export const adminDb = admin.apps.length ? admin.firestore() : null;
