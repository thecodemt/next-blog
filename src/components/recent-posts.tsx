'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'

interface Post {
  id: string
  slug?: string
  title: string
  publishedAt: string
  readTime?: number
  _count?: {
    comments: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

interface RecentPostsProps {
  posts: Post[]
  categories: Category[]
}

export function RecentPosts({ posts, categories }: RecentPostsProps) {
  // Sort by post count
  const sortedCategories = [...categories].sort((a, b) => (b._count?.posts || 0) - (a._count?.posts || 0)).slice(0, 6)

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
              <Calendar className="w-4 h-4" />
              <span>Latest Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">最近更新</h2>
            <p className="text-muted-foreground max-w-md">
              按时间排序的最新文章，助你保持知识体系的实时更新。
            </p>
          </div>
          
          {/* Integrated Categories */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-3 md:items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">热门分类</span>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {sortedCategories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    {cat.name}
                    <span className="ml-1 opacity-50">{cat._count?.posts || 0}</span>
                  </Link>
                ))}
                <Link 
                  href="/categories" 
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  全部 →
                </Link>
              </div>
            </div>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/post/${post.slug || post.id}`}
                className="group block"
              >
                <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6 group">
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-primary/40 group-hover:text-primary transition-colors tracking-tighter">
                            0{index + 1}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold line-clamp-1 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                            {post.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary/60" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary/60" />
                            <span>{post.readTime || 5} min read</span>
                          </div>
                          {post._count?.comments && post._count.comments > 0 && (
                            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                              <span className="text-xs font-bold text-primary">{post._count.comments} 评论</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0 shadow-inner">
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-muted-foreground">暂无更多文章，探索上方分类以发现更多内容。</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/posts"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold shadow-sm"
          >
            <span>查看全部文章</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

