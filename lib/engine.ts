import { UserNeed, UserSolution, getSolutions } from './db';

/**
 * Mock AI logic for summarizing a user's struggle.
 * In a real app, this would call an LLM API.
 */
export async function summarizeStruggle(content: string): Promise<{ summary: string; tags: string[] }> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const words = content.toLowerCase().split(/\s+/);
  const commonIssues = {
    'loneliness': ['lonely', 'alone', 'isolation', 'friend', 'social'],
    'caregiver exhaustion': ['care', 'tired', 'exhausted', 'burnout', 'parent', 'sick'],
    'disability': ['access', 'wheelchair', 'disability', 'navigate', 'support'],
    'mental health': ['anxious', 'depressed', 'struggle', 'sad', 'mental'],
    'student stress': ['study', 'exam', 'pressure', 'school', 'university'],
  };

  const detectedTags: string[] = [];
  for (const [tag, keywords] of Object.entries(commonIssues)) {
    if (keywords.some(kw => words.includes(kw))) {
      detectedTags.push(tag);
    }
  }

  // Fallback tag if none detected
  if (detectedTags.length === 0) detectedTags.push('general support');

  return {
    summary: `You're navigating a phase where ${detectedTags[0]} is a significant part of your experience. Your description highlights a need for ${detectedTags.length > 1 ? detectedTags.slice(1).join(' and ') : 'meaningful connection'}.`,
    tags: detectedTags
  };
}

/**
 * Simple matching engine to find relevant solutions.
 */
export function findMatches(need: UserNeed): UserSolution[] {
  const allSolutions = getSolutions();
  
  return allSolutions
    .map(sol => {
      let score = 0;
      // Tag overlap (high weight)
      const overlap = sol.tags.filter(t => need.tags.includes(t)).length;
      score += overlap * 10;

      // Text similarity (basic check)
      const needWords = need.content.toLowerCase().split(/\s+/);
      const solWords = (sol.title + ' ' + sol.content).toLowerCase().split(/\s+/);
      
      const commonWords = needWords.filter(w => solWords.includes(w) && w.length > 4);
      score += commonWords.length;

      return { ...sol, score };
    })
    .filter(sol => sol.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
