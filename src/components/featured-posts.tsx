'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDateMinimal } from '@/lib/date'

interface Post {
  id: string
  slug?: string
  title: string
  excerpt?: string
  coverImage?: string
  publishedAt: string
  category?: {
    name: string
  }
  readTime?: number
}

interface FeaturedPostsProps {
  posts: Post[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">精选文章</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            探索深度技术解析与实战经验分享，助你构建更好的数字产品。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group block">
              <Card className="h-full flex flex-col overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/50 backdrop-blur-sm relative">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {index === 0 && (
                        <Badge className="bg-primary text-primary-foreground border-0 shadow-lg px-3 py-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          置顶
                        </Badge>
                      )}
                      {post.category && (
                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-foreground border-0 shadow-sm px-3 py-1">
                          {post.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <CardHeader className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary/70" />
                      <span>{post.readTime || 5} min read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="grow">
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6 italic">
                      "{post.excerpt}"
                    </p>
                  )}
                  
                  <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    阅读更多
                    <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex items-center">
                      <TrendingUp className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

