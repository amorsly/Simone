import { NextResponse } from 'next/server';

interface Image {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  sessionId: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
}

// In-memory storage (will reset on each deployment)
let images: Image[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  try {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = images.slice(startIndex, endIndex);

    return NextResponse.json(paginatedImages);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// Add a POST method to save new images
export async function POST(request: Request) {
  try {
    const newImage: Image = await request.json();
    images.unshift(newImage); // Add to the beginning of the array
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Failed to save image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}