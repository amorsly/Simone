import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  const { prompt, sessionId } = await request.json();

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 });
  }

  console.log('Attempting to generate image with prompt:', prompt);

  try {
    console.log('Calling Replicate API...');
    const output = await replicate.run(
      "amorsly/simone:095d58d6d7eda43b90a61ece519f01906bc451d6ed2cbae5b399c5bda368249e",
      {
        input: {
          prompt: prompt
        }
      }
    );

    console.log("Replicate output:", output);

    // Check if output is an array and has at least one element
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
    console.error('Error generating image:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { error: 'Failed to generate image', details: errorMessage },
      { status: 500 }
    );
  }
}