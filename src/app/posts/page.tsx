'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Search, Filter, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'

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
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
            </div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            所有文章
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索我的技术博客，涵盖前端、后端、设计等多个领域
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="搜索文章标题、内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="rounded-full"
            >
              全部分类
            </Button>
            {categories.map((category: any) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                  {category._count?.posts || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: any) => (
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
                      <ArrowRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">没有找到文章</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? '尝试调整搜索词或筛选条件' 
                  : '还没有发布任何文章'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}>
                  清除筛选
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12 text-muted-foreground">
            找到 {filteredPosts.length} 篇文章
            {searchTerm && ` 关于 "${searchTerm}"`}
            {selectedCategory !== 'all' && ` 在 ${categories.find(c => c.id === selectedCategory)?.name} 分类中`}
          </div>
        )}
      </main>
    </div>
  )
}
