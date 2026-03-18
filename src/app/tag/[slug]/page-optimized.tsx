import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Hash, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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

async function getRandomTags(currentTagSlug: string, count: number = 6) {
  try {
    // 获取除当前标签外的所有标签
    const allTags = await prisma.tag.findMany({
      where: {
        slug: {
          not: currentTagSlug
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
      }
    })

    // 随机打乱并取指定数量
    const shuffled = allTags.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('Error fetching random tags:', error)
    return []
  }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const tag = await getTag(resolvedParams.slug)
  const posts = await getTagPosts(resolvedParams.slug)
  const randomTags = await getRandomTags(resolvedParams.slug)

  if (!tag) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        
        {/* 顶部：标签标题区 - 简洁展示 */}
        <div className="mb-16 text-center">
          {/* 巨大的 # 符号和标题 */}
          <div className="flex items-center justify-center gap-8 text-center mb-6">
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
        </div>

        {/* 中部：文章列表 - 每行4个卡片 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
            {posts.map((post: any, index: number) => (
              <Link key={post.id} href={`/post/${post.slug || post.id}`} className="group block">
                <Card className={`h-full overflow-hidden border-border/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm ring-2 ring-transparent hover:ring-${tagColor}-200 dark:hover:ring-${tagColor}-800`}>
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
                    {/* 日期和分类 */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {post.category && (
                        <>
                          <span className="font-medium text-primary">
                            {post.category.name}
                          </span>
                          <span>•</span>
                        </>
                      )}
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
                          variant={postTag.tag.slug === resolvedParams.slug ? "default" : "secondary"}
                          className={`text-[10px] px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-colors ${
                            postTag.tag.slug === resolvedParams.slug ? `bg-${tagColor}-100 text-${tagColor}-800 dark:bg-${tagColor}-900 dark:text-${tagColor}-100 border-${tagColor}-200` : ''
                          }`}
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

        {/* 底部：随机其他标签 */}
        {randomTags.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                探索其他标签
              </h2>
              <p className="text-muted-foreground text-sm">
                发现更多精彩内容
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {randomTags.map((randomTag: any) => (
                <Button
                  key={randomTag.id}
                  variant="outline"
                  asChild
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Link href={`/tag/${randomTag.slug}`}>
                    #{randomTag.name}
                    <span className="ml-2 text-xs opacity-60">
                      ({randomTag._count?.posts || 0})
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
