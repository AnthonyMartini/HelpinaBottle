import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

/**
 * POST /api/share-chat
 * Acts as a therapeutic guide and gatekeeper for contributors.
 * Validates that the story is appropriate and contains an uplifting morale/solution.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages history is required.' },
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
    
    // Configure JSON output schema
    // Note: We use gemini-3.1-flash-lite-preview as requested by the user previously
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            response: {
              type: SchemaType.STRING,
              description: 'The encouraging, therapeutic response to the user.',
            },
            isStoryComplete: {
              type: SchemaType.BOOLEAN,
              description: 'Whether the user has provided a complete, uplifting story with a solution/morale.',
            },
            refinedStory: {
              type: SchemaType.STRING,
              description: 'A polished, cohesive version of the story if isStoryComplete is true.',
            },
            suggestedTitle: {
              type: SchemaType.STRING,
              description: 'A fitting title for the story if isStoryComplete is true.',
            },
            suggestedTags: {
              type: SchemaType.STRING,
              description: 'Comma-separated themes if isStoryComplete is true.',
            }
          },
          required: ['response', 'isStoryComplete'],
        },
      },
    });

    const systemPrompt = `
You are "The Scribe," a therapeutic writing assistant. Your goal is to help users polish their wisdom stories for others to find.

CORE PRINCIPLES:
1. PRESERVE THE VOICE: Keep the 'refinedStory' as close to the user's original input as possible. Only fix grammar, spelling, or very minor flow issues. Do NOT rewrite the story in your own style.
2. BREVITY CHECK: If the user's story is very brief (less than 25-30 words), do NOT set isStoryComplete to true. Instead, use the 'response' field to gently explain why more detail would be helpful for someone else finding their bottle (e.g., "This is a great start. Could you share a bit more about how you found that strength, so it can better guide someone else?").
3. NO METAPHORS: Strictly avoid all "sand," "sea," "tides," or "ocean" metaphors in your conversation.
4. UPLIFTING BREAKTHROUGH: Ensure the story has a "solution" or "lesson." If it's purely a venting session, ask what they learned from it.
5. GATEKEEPING: Only set isStoryComplete to true if it is safe, clear, and ready to guide another person.

When isStoryComplete is true, show the user the 'refinedStory' in the 'response' field for their final approval:
"I have made a few minor adjustments for clarity: [Refined Story]. If you are ready, you can cast your wisdom into the sea."
`;

    // Map messages to Gemini history format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    
    const chat = model.startChat({
      history,
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }],
      },
    });

    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const jsonResponse = JSON.parse(result.response.text());

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Error in /api/share-chat:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
