import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBottles } from '@/lib/db';
import { getTopMatches } from '@/lib/vector';

/**
 * POST /api/cast
 * Finds similar bottles and generates an AI synthesis of comfort.
 */
export async function POST(req: NextRequest) {
  try {
    const { struggleText } = await req.json();

    if (!struggleText || typeof struggleText !== 'string') {
      return NextResponse.json(
        { error: 'struggleText is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    // Initialize Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 1. Generate embedding for the user's struggle
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddingResult = await embeddingModel.embedContent(struggleText);
    const struggleEmbedding = embeddingResult.embedding.values;

    // 2. Fetch all bottles and find top 3 matches
    const allBottles = await getBottles();
    if (allBottles.length === 0) {
      return NextResponse.json(
        { error: 'No past stories found in the database. Please contribute one first!' },
        { status: 404 }
      );
    }

    const topMatches = getTopMatches(struggleEmbedding, allBottles, 3);
    const matchSnippets = topMatches.map((m, i) => `${i + 1}. ${m.text}`).join('\n');

    // 3. Generate empathetic synthesis using gemini-3.1-flash-lite
    const chatModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const prompt = `
User struggle message: "${struggleText}"

The following stories of resilience and wisdom were found:
${matchSnippets}

Act as "The Synthesis," a trained therapeutic writer. Your goal is to provide a brief, professional, and deeply empathetic reflection that connects the user's struggle with the wisdom in these stories.

CORE PRINCIPLES:
1. CONCISENESS: Keep your reflection under 3-4 sentences.
2. THERAPEUTIC TONE: Speak with the empathy and professionalism of a trained counselor.
3. MINIMAL METAPHORS: Avoid "ocean", "bottle", or "wave" imagery. Focus on the core emotional connection.
4. VALIDATION: Start by validating the user's current feeling.

Response:
`;

    const chatResponse = await chatModel.generateContent(prompt);
    const aiSynthesis = chatResponse.response.text();

    // 4. Clean up bottles (remove embeddings) before sending response
    const sanitizedBottles = topMatches.map(({ embedding, ...bottle }) => bottle);

    return NextResponse.json({
      ai_synthesis: aiSynthesis.trim(),
      original_bottles: sanitizedBottles,
    });
  } catch (error: any) {
    console.error('Error in /api/cast:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
