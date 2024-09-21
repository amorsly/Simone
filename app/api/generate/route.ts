import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { prompt, sessionId } = await request.json();

    console.log('Received prompt:', prompt);

    const output = await replicate.run(
      "amorsly/simone:095d58d6d7eda43b90a61ece519f01906bc451d6ed2cbae5b399c5bda368249e",
      { input: { prompt: prompt } }
    );

    console.log('Replicate output:', output);

    // The output is an array of URIs, so we'll take the first one
    const imageUrl = Array.isArray(output) && output.length > 0 ? output[0] : null;

    if (!imageUrl) {
      throw new Error('No image URL returned from Replicate');
    }

    return NextResponse.json({
      id: Date.now().toString(),
      url: imageUrl,
      prompt: prompt,
      createdAt: new Date().toISOString(),
      sessionId: sessionId,
      status: 'succeeded'
    });
  } catch (error: unknown) {
    console.error('Error in /api/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate image', details: errorMessage }, { status: 500 });
  }
}