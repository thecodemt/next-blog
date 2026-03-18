import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import BackToTop from '@/components/back-to-top'

import { prisma } from '@/lib/prisma'

async function getCategory(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    })
    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getCategoryPosts(slug: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category: {
          slug
        },
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })
    return posts
  } catch (error) {
    console.error('Error fetching category posts:', error)
    return []
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const category = await getCategory(resolvedParams.slug)
  const posts = await getCategoryPosts(resolvedParams.slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <main className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
              <span className="text-3xl font-bold text-muted-foreground">?</span>
            </div>
            <h1 className="text-3xl font-bold">分类不存在</h1>
            <p className="text-muted-foreground text-lg">
              抱歉，您访问的分类可能已被删除或不存在。
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/">
                返回首页探索
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <main className="container mx-auto px-4 py-12 lg:py-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link 
            href="/posts" 
            className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>返回所有文章</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-8">
          <div className="inline-flex flex-col items-center">
            <div className="w-24 h-24 bg-linear-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 group hover:scale-105 transition-transform duration-500">
              <span className="text-white text-4xl font-black">
                {category.name.charAt(0)}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                {category.name}
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-bold bg-primary/10 text-primary border-0">
                  {category._count?.posts || 0} 篇文章
                </Badge>
                {category.description && (
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                )}
              </div>
            </div>
          </div>
          
          {category.description && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium italic">
              "{category.description}"
            </p>
          )}
        </div>

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group h-full">
                  <Card className="h-full flex flex-col overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/50 backdrop-blur-sm group-hover:-translate-y-2">
                    {/* Cover Image */}
                    <div className="relative h-56 w-full overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

                    <CardContent className="flex-grow flex flex-col justify-between">
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
            <div className="max-w-2xl mx-auto text-center py-24 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="relative inline-block mb-6">
                <Layers className="w-20 h-20 text-muted-foreground/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Layers className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">该分类暂无文章</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                目前 "{category.name}" 分类下还没有发布任何文章。您可以浏览其他分类的内容。
              </p>
              <Button asChild className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                <Link href="/posts">
                  浏览所有文章
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <BackToTop />
    </div>
  )
}
