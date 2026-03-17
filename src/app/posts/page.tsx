'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Search, Filter, ArrowRight, BookOpen, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'
import { PostCardSkeleton } from '@/components/post-card-skeleton'
import { getRandomImageForPost } from '@/lib/image-urls'

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  return res.json()
}

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPosts(),
          getCategories()
        ])
        setPosts(postsData)
        setFilteredPosts(postsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post: any) => 
        post.category?.id === selectedCategory
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory, posts])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <main className="container mx-auto px-4 py-12">
          {/* Skeleton Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto animate-pulse" />
            <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto animate-pulse" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide uppercase">
            <Layers className="w-4 h-4" />
            <span>文章归档</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            探索所有文章
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            涵盖前端开发、后端架构、UI/UX 设计以及技术趋势的深度探索。
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-5xl mx-auto mb-16 space-y-8">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
              <Input
                placeholder="搜索文章标题、内容、摘要..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 text-lg bg-background/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 focus:ring-primary/20 focus:border-primary rounded-2xl shadow-xl transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "rounded-full px-6 h-10 transition-all duration-300",
                selectedCategory === 'all' ? "shadow-lg shadow-primary/25" : "hover:bg-primary/5"
              )}
            >
              全部分类
            </Button>
            {categories.map((category: any) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full px-6 h-10 transition-all duration-300 group",
                  selectedCategory === category.id ? "shadow-lg shadow-primary/25" : "hover:bg-primary/5"
                )}
              >
                {category.name}
                <Badge 
                  variant={selectedCategory === category.id ? 'secondary' : 'outline'} 
                  className={cn(
                    "ml-2 px-1.5 py-0 min-w-5 flex items-center justify-center text-[10px]",
                    selectedCategory === category.id ? "bg-white/20 border-0" : "group-hover:bg-primary/10"
                  )}
                >
                  {category._count?.posts || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: any, index: number) => (
              <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group h-full">
                <Card className="h-full flex flex-col overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/50 backdrop-blur-sm group-hover:-translate-y-2">
                  {/* Cover Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={getRandomImageForPost(post.id, index)}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-foreground border-0 shadow-sm px-3 py-1 font-semibold">
                          {post.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-3 pt-6">
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
                    
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="grow flex flex-col justify-between">
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                      阅读全文
                      <ArrowRight className="w-4 h-4 ml-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-24 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="relative inline-block mb-6">
              <Search className="w-20 h-20 text-muted-foreground/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">未找到相关文章</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm || selectedCategory !== 'all' 
                ? `抱歉，我们没有找到与 "${searchTerm || categories.find(c => c.id === selectedCategory)?.name}" 相关的结果。` 
                : '目前还没有发布任何文章，请稍后再来。'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}
                className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20"
              >
                重置搜索与筛选
              </Button>
            )}
          </div>
        )}

        {/* Results Info Footer */}
        {filteredPosts.length > 0 && (
          <div className="mt-20 flex flex-col items-center gap-4">
            <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
            <p className="text-muted-foreground font-medium italic">
              — 共找到 {filteredPosts.length} 篇文章 —
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
