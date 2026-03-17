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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">精选文章</h2>
          <Badge variant="secondary" className="text-sm">
            深度长文
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-linear-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-md group">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-500" />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {index === 0 && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-lg backdrop-blur-sm border-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          置顶
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    {post.category && (
                      <>
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                          {post.category.name}
                        </Badge>
                        <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-3">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="pt-0">
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{post.readTime || 5} 分钟</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
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
