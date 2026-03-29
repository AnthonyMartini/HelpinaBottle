import { adminDb } from "./firebase";

export interface Bottle {
  id: string;
  text: string;
  embedding: number[];
  createdAt?: string;
}

const BOTTLES_COLLECTION = "bottles";

export async function getBottles(): Promise<Bottle[]> {
  if (!adminDb) {
    console.warn("Firebase Admin DB not initialized. Check your environment variables.");
    return [];
  }
  try {
    const bottlesRef = adminDb.collection(BOTTLES_COLLECTION);
    const snapshot = await bottlesRef
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bottle[];
  } catch (error) {
    console.error("Error fetching bottles from Firestore:", error);
    return [];
  }
}

/**
 * Saves a new bottle (wisdom story) to Firestore.
 */
export async function saveBottle(bottle: Omit<Bottle, 'id'>): Promise<string> {
  if (!adminDb) {
    console.error("Firebase Admin DB not initialized. Cannot save bottle.");
    throw new Error("Cloud storage is currently unavailable.");
  }
  try {
    const docRef = await adminDb.collection(BOTTLES_COLLECTION).add({
      ...bottle,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving bottle to Firestore:", error);
    throw new Error("Failed to save wisdom to the cloud.");
  }
}

/**
 * Finds a specific bottle by its Firestore Document ID.
 */
export async function getBottleById(id: string): Promise<Bottle | null> {
  if (!adminDb) {
    console.warn("Firebase Admin DB not initialized. Cannot fetch bottle by ID.");
    return null;
  }
  try {
    const docRef = adminDb.collection(BOTTLES_COLLECTION).doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as Bottle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching bottle by ID:", error);
    return null;
  }
}
