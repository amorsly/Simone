import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface Image {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  sessionId: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  try {
    const images = await kv.lrange<Image>('images', 0, -1);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = images.slice(startIndex, endIndex);

    return NextResponse.json(paginatedImages);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newImage: Image = await request.json();
    await kv.lpush('images', JSON.stringify(newImage));
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Failed to save image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}