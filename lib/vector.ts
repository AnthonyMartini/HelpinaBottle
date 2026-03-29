import { Bottle } from './db';

/**
 * Calculates the cosine similarity between two vectors.
 * Dot product divided by the product of their magnitudes.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length.');
  }

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dotProduct / (magA * magB);
}

/**
 * Maps through all bottles, scores them using cosineSimilarity,
 * sorts them descending by score, and returns the top matches.
 */
export function getTopMatches(
  queryEmbedding: number[],
  bottles: Bottle[],
  limit: number = 3
): Bottle[] {
  return bottles
    .map((bottle) => ({
      ...bottle,
      score: cosineSimilarity(queryEmbedding, bottle.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    // Remove the temporary score field before returning
    .map(({ score, ...bottle }) => bottle);
}
