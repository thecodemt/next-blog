import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, BookOpen, Layers, Folder } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { getRandomImageForPost } from '@/lib/image-urls'
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

async function getRelatedCategories(currentCategorySlug: string) {
  try {
    // 获取其他分类
    const relatedCategories = await prisma.category.findMany({
      where: {
        slug: {
          not: currentCategorySlug
        }
      },
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

    // 按文章数量排序并取前6个
    return relatedCategories
      .sort((a, b) => (b._count?.posts || 0) - (a._count?.posts || 0))
      .slice(0, 6)
  } catch (error) {
    console.error('Error fetching related categories:', error)
    return []
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const category = await getCategory(resolvedParams.slug)
  const posts = await getCategoryPosts(resolvedParams.slug)
  const relatedCategories = await getRelatedCategories(resolvedParams.slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
            <p className="text-muted-foreground mb-6">
              您访问的分类可能已被删除或不存在
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

  // 为分类生成颜色
  const categoryColors = {
    'frontend': 'blue',
    'backend': 'green',
    'fullstack': 'purple',
    'devops': 'orange',
    'design': 'pink',
    'mobile': 'cyan',
    'ai': 'indigo',
    'database': 'teal'
  }

  const colorKey = Object.keys(categoryColors).find(key => 
    category.name.toLowerCase().includes(key)
  ) || 'primary'
  
  const categoryColor = categoryColors[colorKey as keyof typeof categoryColors] || 'primary'

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        
        {/* 1. 顶部：分类标题区 - 简洁展示 */}
        <div className="mb-16 text-center">
          {/* 巨大的文件夹图标和标题 */}
          <div className="flex items-center justify-center gap-8 text-center mb-6">
            <div className={`text-7xl font-bold text-${categoryColor}-200 dark:text-${categoryColor}-800 opacity-10`}>
              <Folder />
            </div>
            <div className="text-left">
              <h1 className={`text-5xl font-black text-${categoryColor}-900 dark:text-${categoryColor}-100 mb-3`}>
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                共发现 <span className={`font-bold text-${categoryColor}-600 dark:text-${categoryColor}-400`}>{category._count?.posts || 0}</span> 篇相关文章
              </p>
              {category.description && (
                <p className="text-muted-foreground text-sm mt-2 italic">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. 中部：增强版文章列表 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
            {posts.map((post: any, index: number) => (
              <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group block">
                <Card className={`h-full overflow-hidden border-border/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm ring-2 ring-transparent hover:ring-${categoryColor}-200 dark:hover:ring-${categoryColor}-800`}>
                  {/* 顶部图片 */}
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={getRandomImageForPost(post.id, index)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* 内容区域 */}
                  <div className="p-4 space-y-3">
                    {/* 日期 */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <time dateTime={new Date(post.publishedAt).toISOString()} className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime || 5}m</span>
                      </div>
                    </div>
                    
                    {/* 标题 */}
                    <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>

                    {/* 摘要预览 */}
                    {post.excerpt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* 标签 */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {post.tags.slice(0, 2).map((postTag: any) => (
                        <Badge 
                          key={postTag.tag.id}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          #{postTag.tag.name}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{post.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="max-w-md mx-auto">
              <div className={`w-20 h-20 bg-${categoryColor}-100 dark:bg-${categoryColor}-900 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                <Layers className={`w-10 h-10 text-${categoryColor}-400`} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">暂无相关文章</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                该分类下还没有发布任何文章
              </p>
              <Button size="lg" asChild>
                <Link href="/posts">
                  浏览所有文章
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* 3. 底部：跨频道导流 */}
        {relatedCategories.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Folder className="w-5 h-5 text-primary" />
                探索其他分类
              </h2>
              <p className="text-muted-foreground text-sm">
                发现更多精彩内容，拓展你的知识边界
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {relatedCategories.map((relatedCategory: any) => (
                <Button
                  key={relatedCategory.id}
                  variant="outline"
                  asChild
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Link href={`/category/${relatedCategory.slug}`}>
                    {relatedCategory.name}
                    <span className="ml-2 text-xs opacity-60">
                      ({relatedCategory._count?.posts || 0})
                    </span>
                  </Link>
                </Button>
              ))}
            </div>

            {/* 返回所有文章按钮 */}
            <div className="text-center pt-8 border-t border-border/30">
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="rounded-full px-8 py-3"
              >
                <Link href="/posts" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回所有文章
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Back to Top */}
        <BackToTop />
      </main>
    </div>
  )
}
