const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  console.error('Error: Firebase environment variables are missing in .env');
  process.exit(1);
}

function getFirebaseConfig() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

// Initialize Admin SDK
if (!admin.apps.length) {
  const config = getFirebaseConfig();
  if (config) {
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
  } else {
    console.error('Error: Firebase credentials missing in .env');
    process.exit(1);
  }
}

const db = admin.firestore();
const BOTTLES_PATH = path.join(__dirname, '..', 'data', 'bottles.json');

async function migrate() {
  try {
    if (!fs.existsSync(BOTTLES_PATH)) {
      console.log('No local bottles.json found. Nothing to migrate.');
      return;
    }

    const data = fs.readFileSync(BOTTLES_PATH, 'utf-8');
    const bottles = JSON.parse(data);

    if (!Array.isArray(bottles) || bottles.length === 0) {
      console.log('bottles.json is empty or invalid.');
      return;
    }

    console.log(`Starting migration of ${bottles.length} stories to Firestore...`);

    const collectionRef = db.collection('bottles');
    let count = 0;

    for (const bottle of bottles) {
      const docId = bottle.id || undefined;
      const { id, ...dataToSave } = bottle;
      
      try {
        if (docId) {
          await collectionRef.doc(docId).set({
            ...dataToSave,
            migratedAt: new Date().toISOString()
          });
        } else {
          await collectionRef.add({
            ...dataToSave,
            migratedAt: new Date().toISOString()
          });
        }
        count++;
        if (count % 10 === 0) console.log(`Migrated ${count}/${bottles.length}...`);
      } catch (e) {
        console.error(`Failed to migrate bottle ${docId || 'new'}:`, e.message);
      }
    }

    console.log(`✅ Migration complete! ${count} stories are now in the cloud.`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrate();
