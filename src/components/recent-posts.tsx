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

interface RecentPostsProps {
  posts: Post[]
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts.length) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">最近更新</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            按时间排序的最新文章，保持知识更新
          </p>
        </div>

        <Card className="bg-linear-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-lg border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {posts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug || post.id}`}
                  className={cn(
                    'flex items-center justify-between p-4 hover:bg-accent/30 transition-all duration-300 group border-b border-white/10 last:border-b-0 hover:border-primary/20',
                    index === 0 && 'border-t-0'
                  )}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors mb-2 group-hover:translate-x-1 duration-200">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime || 5} 分钟</span>
                      </div>
                      {post._count?.comments && post._count.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          <span>{post._count.comments} 评论</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 shrink-0" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            查看全部文章
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
