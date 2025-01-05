import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(request: Request) {
  console.log('Starting Groq API request...');

  if (!process.env.GROQ_API_KEY) {
    console.error('Missing Groq API key');
    return NextResponse.json({ error: 'Missing API key configuration' }, { status: 500 });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const body = await request.json();
    console.log('Request body:', JSON.stringify(body));

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
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}