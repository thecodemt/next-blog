import { HeroSection } from '@/components/hero-section'
import { LatestPosts } from '@/components/latest-posts'
import { TechStack } from '@/components/tech-stack'
import { prisma } from '@/lib/prisma'

// 服务端直接使用 prisma 获取数据
async function getHomeData() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })
    return posts
  } catch (error) {
    console.error('Error fetching home data:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getHomeData()
  const latestPosts = posts.slice(0, 5)

  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-blue-100 dark:selection:bg-blue-900/30">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03]" />

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-32 space-y-24">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Latest Posts Section */}
        <LatestPosts posts={latestPosts} />

        {/* 3. Tech Stack Section */}
        <TechStack />
      </main>
    </div>
  )
}
