import { adminDb } from "./firebase";

export interface Bottle {
  id: string;
  text: string;
  embedding: number[];
  createdAt?: string;
}

const BOTTLES_COLLECTION = "bottles";

/**
 * Fetches the most recent bottles from Firestore for semantic search.
 * We limit to 200 for performance/free tier reasons.
 */
export async function getBottles(): Promise<Bottle[]> {
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
