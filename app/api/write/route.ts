import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveBottle } from '@/lib/db';

/**
 * POST /api/write
 * Submits a new survival story/bottle.
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
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
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

    // Generate embedding
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    // Generate unique ID
    const id = crypto.randomUUID();

    // Save bottle
    const createdAt = new Date().toISOString();
    const bottle = { id, text, embedding, createdAt, likes: 0 };
    await saveBottle(bottle);

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    console.error('Error in /api/write:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
