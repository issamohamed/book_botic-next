import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    groqKeyExists: !!process.env.GROQ_API_KEY,
    exaKeyExists: !!process.env.EXA_API_KEY,
  });
}