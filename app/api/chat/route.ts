import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

/**
 * POST /api/chat
 * Acts as an empathetic "gatekeeper" and bridge chat.
 * Validates the user's struggle and determines if it's ready to be cast.
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
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            response: {
              type: SchemaType.STRING,
              description: 'The empathetic, therapeutic response to the user.',
            },
            isReadyToCast: {
              type: SchemaType.BOOLEAN,
              description: 'Whether the user has provided a clear, appropriate life struggle ready for matching.',
            },
            suggestedStruggleSummary: {
              type: SchemaType.STRING,
              description: 'A concise, clarified version of the user struggle if isReadyToCast is true.',
            },
          },
          required: ['response', 'isReadyToCast'],
        },
      },
    });

    const systemPrompt = `
You are "The Guardian," a grounded therapeutic presence. Your goal is to provide a safe, professional space for users to express their struggles.

CORE PRINCIPLES:
1. MAXIMAL CONCISENESS: Keep your responses extremely brief. Focus immediately on the user's struggle.
2. THERAPEUTIC PROFESSIONALISM: Speak with the directness and empathy of a clinical professional. Avoid flowery language or poetic descriptions of the user's journey.
3. NO METAPHORS: Strictly avoid all "ocean," "wave," "tide," or "sea" metaphors in your conversation. Focus entirely on the human experience.
4. NO ADVICE: Your role is to listen and validate, not to solve the user's problem.
5. GATEKEEPING: Only set isReadyToCast to true if the user has shared a meaningful personal struggle or question.

When isReadyToCast is true, show the user the 'suggestedStruggleSummary' for their final approval:
"I have summarized your core struggle as: [Summary]. If this is accurate, you are ready to cast your message."
`;

    // Map messages to Gemini history format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    
    // If history is empty, add a dummy welcome if necessary or just use the system prompt
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
    console.error('Error in /api/chat:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
