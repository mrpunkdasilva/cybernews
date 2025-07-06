
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { storyId } = await req.json();

    if (!storyId || typeof storyId !== 'number') {
      return NextResponse.json({ error: 'Invalid storyId' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if the post is already saved
    const existingSavedPost = await prisma.savedPost.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (existingSavedPost) {
      // If it exists, delete it (unsave)
      await prisma.savedPost.delete({
        where: {
          id: existingSavedPost.id,
        },
      });
      return NextResponse.json({ message: 'Post unsaved successfully', saved: false }, { status: 200 });
    } else {
      // If it does not exist, create it (save)
      await prisma.savedPost.create({
        data: {
          userId,
          storyId,
        },
      });
      return NextResponse.json({ message: 'Post saved successfully', saved: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
