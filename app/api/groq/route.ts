import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
    console.log('Groq POST endpoint hit');

    if (!process.env.GROQ_API_KEY) {
        console.error('Missing Groq API key');
        return NextResponse.json({ error: 'Missing API key configuration' }, { status: 500 });
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const body = await request.json();
        console.log('Processing request with body:', body);

        const completion = await groq.chat.completions.create({
            messages: body.messages,
            model: "llama-3.3-70b-versatile",
            temperature: body.temperature || 0.7,
            max_tokens: body.max_tokens || 1024,
        });

        console.log('Groq API response received');
        return NextResponse.json({ result: completion.choices[0]?.message?.content });
    } catch (error) {
        console.error('Groq API error:', error);
        // Enhanced error response
        const errorResponse = {
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

// Test endpoint
export async function GET() {
    return NextResponse.json({ 
        status: 'Groq endpoint active',
        timestamp: new Date().toISOString()
    });
}