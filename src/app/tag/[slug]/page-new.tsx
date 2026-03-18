import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowLeft, Hash, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { getRandomImageForPost } from '@/lib/image-urls'
import { BackToTopButton } from '@/components/back-to-top-button'

import { prisma } from '@/lib/prisma'

async function getTag(slug: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: 'PUBLISHED'
                }
              }
            }
          }
        }
      }
    })
    return tag
  } catch (error) {
    console.error('Error fetching tag:', error)
    return null
  }
}

async function getTagPosts(slug: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug
            }
          }
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
    console.error('Error fetching tag posts:', error)
    return []
  }
}

async function getRelatedTags(currentTagSlug: string) {
  try {
    // 获取包含当前标签的文章
    const postsWithCurrentTag = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug: currentTagSlug
            }
          }
        },
        status: 'PUBLISHED'
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      take: 10
    })

    // 提取这些文章中的其他标签
    const otherTags = new Set<string>()
    postsWithCurrentTag.forEach(post => {
      post.tags.forEach(postTag => {
        if (postTag.tag.slug !== currentTagSlug) {
          otherTags.add(postTag.tag.slug)
        }
      })
    })

    // 获取相关标签的详细信息
    const relatedTags = await prisma.tag.findMany({
      where: {
        slug: {
          in: Array.from(otherTags).slice(0, 6) // 最多6个相关标签
        }
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: 'PUBLISHED'
                }
              }
            }
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    })

    return relatedTags
  } catch (error) {
    console.error('Error fetching related tags:', error)
    return []
  }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const tag = await getTag(resolvedParams.slug)
  const posts = await getTagPosts(resolvedParams.slug)
  const relatedTags = await getRelatedTags(resolvedParams.slug)

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

  // 为标签生成颜色
  const tagColors = {
    'next-js': 'blue',
    'react': 'cyan',
    'typescript': 'blue',
    'tailwind': 'teal',
    'prisma': 'indigo',
    'javascript': 'yellow',
    'css': 'pink',
    'html': 'orange',
    'node': 'green',
    'api': 'purple'
  }

  const colorKey = Object.keys(tagColors).find(key => 
    tag.name.toLowerCase().includes(key.replace('-', ''))
  ) || 'primary'
  
  const tagColor = tagColors[colorKey as keyof typeof tagColors] || 'primary'

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* 1. 顶部：标签标题区 - 巨大的身份确认 */}
        <div className={`relative mb-16 py-12 px-8 rounded-3xl bg-${tagColor}-50/50 dark:bg-${tagColor}-950/20 border border-${tagColor}-100/50 dark:border-${tagColor}-900/30`}>
          {/* 返回按钮 */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="ghost" 
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Link>
            </Button>
          </div>

          {/* 巨大的 # 符号 */}
          <div className="flex items-center justify-center gap-8 text-center">
            <div className={`text-7xl font-bold text-${tagColor}-200 dark:text-${tagColor}-800 opacity-10`}>
              #
            </div>
            <div className="text-left">
              <h1 className={`text-5xl font-black text-${tagColor}-900 dark:text-${tagColor}-100 mb-3`}>
                {tag.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                共发现 <span className={`font-bold text-${tagColor}-600 dark:text-${tagColor}-400`}>{tag._count?.posts || 0}</span> 篇相关文章
              </p>
            </div>
          </div>

          {/* 装饰性背景元素 */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-${tagColor}-100/20 dark:bg-${tagColor}-800/10 rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 left-0 w-24 h-24 bg-${tagColor}-100/20 dark:bg-${tagColor}-800/10 rounded-full blur-2xl`} />
        </div>

        {/* 2. 中部：增强版文章列表 */}
        {posts.length > 0 ? (
          <div className="space-y-8 mb-16">
            {posts.map((post: any, index: number) => (
              <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group block">
                <Card className={`overflow-hidden border-border/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm ${post.tags.some((t: any) => t.tag.slug === resolvedParams.slug) ? `ring-2 ring-${tagColor}-200 dark:ring-${tagColor}-800` : ''}`}>
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* 左侧图片 */}
                    <div className="relative w-full md:w-48 h-48 md:h-32 overflow-hidden rounded-xl shrink-0">
                      <Image
                        src={getRandomImageForPost(post.id, index)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 space-y-3">
                      {/* 日期和分类 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {post.publishedAt && (
                          <time dateTime={new Date(post.publishedAt).toISOString()} className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        {post.category && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-primary">
                              {post.category.name}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime || 5} 分钟</span>
                        </div>
                      </div>
                      
                      {/* 标题 */}
                      <h3 className="text-xl md:text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>

                      {/* 摘要预览 */}
                      {post.excerpt && (
                        <p className="text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 标签 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.tags.map((postTag: any) => (
                          <Badge 
                            key={postTag.tag.id}
                            variant={postTag.tag.slug === resolvedParams.slug ? "default" : "secondary"}
                            className={`text-xs ${postTag.tag.slug === resolvedParams.slug ? `bg-${tagColor}-100 text-${tagColor}-800 dark:bg-${tagColor}-900 dark:text-${tagColor}-100 border-${tagColor}-200` : ''}`}
                          >
                            #{postTag.tag.name}
                          </Badge>
                        ))}
                      </div>

                      {/* 交互提示 */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>阅读全文</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="max-w-md mx-auto">
              <div className={`w-20 h-20 bg-${tagColor}-100 dark:bg-${tagColor}-900 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                <Hash className={`w-10 h-10 text-${tagColor}-400`} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">暂无相关文章</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                该标签下还没有发布任何文章
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
        {relatedTags.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                你可能也感兴趣
              </h2>
              <p className="text-muted-foreground text-sm">
                探索相关标签，发现更多精彩内容
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {relatedTags.map((relatedTag: any) => (
                <Button
                  key={relatedTag.id}
                  variant="outline"
                  asChild
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Link href={`/tag/${relatedTag.slug}`}>
                    #{relatedTag.name}
                    <span className="ml-2 text-xs opacity-60">
                      ({relatedTag._count?.posts || 0})
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
        <BackToTopButton />
      </main>
    </div>
  )
}
