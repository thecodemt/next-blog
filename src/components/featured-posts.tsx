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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">精选文章</h2>
          <Badge variant="secondary" className="text-sm">
            深度长文
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {index === 0 && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        置顶
                      </Badge>
                    )}
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    {post.category && (
                      <>
                        <span className="font-medium text-primary">{post.category.name}</span>
                        <span>•</span>
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="pt-0">
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{post.readTime || 5} 分钟阅读</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDateMinimal(post.publishedAt)}</span>
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
