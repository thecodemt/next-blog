// app/page.tsx
import { HeroSection } from '@/components/hero-section'
import { FeaturedPosts } from '@/components/featured-posts'
import { RecentPosts } from '@/components/recent-posts'

// 服务端获取数据，减少客户端 JS 体积
async function getHomeData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // 并行请求提高速度
  const [postsRes, catsRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts`, { next: { revalidate: 3600 } }),
    fetch(`${baseUrl}/api/categories`, { next: { revalidate: 3600 } })
  ])

  if (!postsRes.ok || !catsRes.ok) return { posts: [], categories: [] }
  
  return {
    posts: await postsRes.json(),
    categories: await catsRes.json()
  }
}

export default async function Home() {
  const { posts, categories } = await getHomeData()
  
  const featuredPosts = posts.slice(0, 3)
  const recentPosts = posts.slice(3, 10)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - 紧凑设计 */}
        <section className="py-12 md:py-16">
          <HeroSection />
        </section>

        {/* 内容区域 - 统一布局 */}
        <div className="space-y-16 md:space-y-20 py-8">
          {/* Featured Posts */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-medium text-slate-900 dark:text-white">精选文章</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Featured</span>
            </div>
            <FeaturedPosts posts={featuredPosts} />
          </section>

          {/* Recent Posts */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-medium text-slate-900 dark:text-white">最新发布</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Recent</span>
            </div>
            <RecentPosts posts={recentPosts} categories={categories} />
          </section>
        </div>
      </main>
    </div>
  )
}