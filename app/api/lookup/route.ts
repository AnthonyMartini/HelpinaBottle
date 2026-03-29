import { NextRequest, NextResponse } from 'next/server';
import { getBottleById } from '@/lib/db';

/**
 * GET /api/lookup?id=...
 * Fetches a specific bottle by its ID.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required.' }, { status: 400 });
    }

    const bottle = await getBottleById(id);

    if (!bottle) {
      return NextResponse.json({ error: 'No message found with this ID.' }, { status: 404 });
    }

    // Sanitize: don't return embedding
    const { embedding, ...sanitizedBottle } = bottle;

    return NextResponse.json(sanitizedBottle);
  } catch (error: any) {
    console.error('Error in /api/lookup:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
