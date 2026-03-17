'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'

async function getTag(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tags/${slug}`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

async function getTagPosts(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tags/${slug}/posts`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    return []
  }
  
  return res.json()
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const tag = await getTag(resolvedParams.slug)
  const posts = await getTagPosts(resolvedParams.slug)

  if (!tag) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">标签不存在</h1>
            <p className="text-muted-foreground mb-6">
              您访问的标签可能已被删除或不存在
            </p>
            <Button asChild>
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
          
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">#{tag.name}</h1>
              <p className="text-muted-foreground">
                {tag._count?.posts || 0} 篇相关文章
              </p>
            </div>
          </div>
          
          {tag.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tag.description}
            </p>
          )}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group">
                <Card className="overflow-hidden border-border/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      {post.category && (
                        <>
                          <span className="font-medium text-primary">
                            {post.category.name}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <time dateTime={post.publishedAt} className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </time>
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
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime || 5} 分钟</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Hash className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">暂无相关文章</h3>
              <p className="text-muted-foreground mb-6">
                该标签下还没有发布任何文章
              </p>
              <Button asChild>
                <Link href="/">
                  浏览其他标签
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Back to Top */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              返回顶部
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
