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
You are "The Scribe," a grounded therapeutic writer. Your goal is to help users capture their resilience stories in a clear, professional way.

CORE PRINCIPLES:
1. MAXIMAL CONCISENESS: Keep your responses extremely brief. Focus immediately on the user's breakthrough.
2. THERAPEUTIC PROFESSIONALISM: Speak with the directness and empathy of a clinical professional. Use active listening, but avoid flowery language or poetic descriptions of their "journey."
3. NO METAPHORS: Strictly avoid all "sand," "sea," "tides," or "ocean" metaphors in your conversation. Focus entirely on the human experience and the lesson learned.
4. UPLIFTING BREAKTHROUGH: Every story must have a "solution" or "morale." If it's purely negative, gently request a lesson they've learned from it.
5. GATEKEEPING: Only set isStoryComplete to true if the story is appropriate, clear, and provides a lesson for others.

When isStoryComplete is true, show the user the 'refinedStory' for their final approval:
"I have refined your experience as follows: [Refined Story]. If you approve, your wisdom is ready to be shared."
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
