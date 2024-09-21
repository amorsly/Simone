import { NextResponse } from 'next/server';

// Define the structure of an image object
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
  const _page = Number(searchParams.get('page')) || 1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _limit = Number(searchParams.get('limit')) || 20;

  try {
    // In a real application, you'd fetch images from your database
    // const images = await db.images.findMany({
    //   take: limit,
    //   skip: (page - 1) * limit,
    //   orderBy: { createdAt: 'desc' },
    // });

    // For now, we'll return an empty array of Image type
    const images: Image[] = [];

    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}