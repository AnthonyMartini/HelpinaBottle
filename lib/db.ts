import fs from 'fs/promises';
import path from 'path';

export interface Bottle {
  id: string;
  text: string;
  embedding: number[];
  createdAt?: string;
  likes: number;
}

const DB_PATH = path.join(process.cwd(), 'data', 'bottles.json');

/**
 * Safely reads and parses the local bottles JSON file.
 * Returns an empty array if the file doesn't exist.
 */
export async function getBottles(): Promise<Bottle[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Bottle[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading bottles database:', error);
    throw new Error('Failed to read from local database.');
  }
}

/**
 * Reads the current array, pushes the new bottle, and overwrites the JSON file.
 */
export async function saveBottle(bottle: Bottle): Promise<void> {
  try {
    const currentBottles = await getBottles();
    currentBottles.push(bottle);
    await fs.writeFile(DB_PATH, JSON.stringify(currentBottles, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving bottle to database:', error);
    throw new Error('Failed to save to local database.');
  }
}

/**
 * Finds a specific bottle by its unique ID.
 */
export async function getBottleById(id: string): Promise<Bottle | null> {
  const bottles = await getBottles();
  return bottles.find((b) => b.id === id) || null;
}

/**
 * Atomic-ish increment for likes in a local JSON file.
 */
export async function incrementLikes(id: string): Promise<number | null> {
  try {
    const bottles = await getBottles();
    const index = bottles.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bottles[index].likes = (bottles[index].likes || 0) + 1;
    await fs.writeFile(DB_PATH, JSON.stringify(bottles, null, 2), 'utf-8');
    return bottles[index].likes;
  } catch (error) {
    console.error('Error incrementing likes:', error);
    throw new Error('Failed to update likes.');
  }
}
