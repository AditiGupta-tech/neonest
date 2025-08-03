import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Using Web Speech API for text-to-speech
    // This will be handled on the client side since Web Speech API is browser-based
    return NextResponse.json({ 
      success: true, 
      message: 'Text-to-speech ready for client-side processing' 
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Text-to-speech failed' }, { status: 500 });
  }
} 