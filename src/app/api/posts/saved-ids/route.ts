
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Return empty array if not logged in, as this is public-facing
    return NextResponse.json([], { status: 200 });
  }

  try {
    const userId = session.user.id;
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      select: { storyId: true },
    });

    const savedStoryIds = savedPosts.map(p => p.storyId);
    return NextResponse.json(savedStoryIds, { status: 200 });

  } catch (error) {
    console.error("Error fetching saved post IDs:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
