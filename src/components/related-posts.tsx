import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/date'

interface Post {
  id: string
  slug: string
  title: string
  coverImage?: string
  publishedAt: string
  readTime?: number
}

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <div className="mt-16 pt-16 border-t border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">推荐阅读</h2>
        <Link 
          href="/posts" 
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
        >
          查看全部
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.slug}`} className="group">
            <Card className="h-full overflow-hidden border-border/20 hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="relative h-40 w-full overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime || 5} min
                  </div>
                </div>
                <h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
