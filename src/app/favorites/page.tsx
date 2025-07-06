
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MainLayout } from '@/components/layout/MainLayout';
import { StoryList } from '@/components/features/StoryList/StoryList';
import { hackerNewsApi } from '@/services/hackerNewsAPI';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getSavedStories(userId: string) {
  const savedPosts = await prisma.savedPost.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { storyId: true },
  });

  const storyIds = savedPosts.map(p => p.storyId);
  if (storyIds.length === 0) {
    return { stories: [], savedStoryIds: [] };
  }

  const storyPromises = storyIds.map(id => hackerNewsApi.getStory(id));
  const stories = await Promise.all(storyPromises);
  
  // Filter out any null stories if an ID was invalid
  const validStories = stories.filter(story => story !== null);

  return { stories: validStories, savedStoryIds: storyIds };
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-cyber-neon mb-4">Access Denied</h1>
          <p className="text-cyber-neon/70">You must be logged in to view your saved stories.</p>
          <Link href="/api/auth/signin" className="mt-6 inline-block px-6 py-2 text-sm font-bold text-black bg-cyan-400 rounded-md hover:bg-cyan-500 transition-colors">
            Sign In
          </Link>
        </div>
      </MainLayout>
    );
  }

  const { stories, savedStoryIds } = await getSavedStories(session.user.id);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-orbitron text-cyber-green">Saved Stories</h1>
        {stories.length > 0 ? (
          <StoryList stories={stories} />
        ) : (
          <p className="text-cyber-neon/70">You haven't saved any stories yet.</p>
        )}
      </div>
    </MainLayout>
  );
}
