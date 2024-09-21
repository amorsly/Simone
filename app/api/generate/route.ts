import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { prompt, sessionId } = await request.json();

    console.log('Received prompt:', prompt);
    console.log('Session ID:', sessionId);

    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not set');
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 });
    }

    console.log('Calling Replicate API...');
    const output = await replicate.run(
      "amorsly/simone:95d62527bec54e40a82eba247d0ec753146ba4e62ba0a73db4c3f2f15b04e73a",
      {
        input: {
          prompt: prompt,
          negative_prompt: "",
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
          seed: null
        }
      }
    );

    console.log('Replicate API response:', output);

    // Check if output is an array and has at least one element
    const imageUrl = Array.isArray(output) && output.length > 0 ? output[0] : null;

    if (!imageUrl) {
      console.error('No image URL returned from Replicate');
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}