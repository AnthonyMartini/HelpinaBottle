import { NextRequest, NextResponse } from 'next/server';
import { incrementLikes } from '@/lib/db';

/**
 * POST /api/like
 * Increments the like count for a specific bottle.
 */
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required.' }, { status: 400 });
    }

    const newLikeCount = await incrementLikes(id);

    if (newLikeCount === null) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: newLikeCount });
  } catch (error: any) {
    console.error('Error in /api/like:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update resonance.' },
      { status: 500 }
    );
  }
}
