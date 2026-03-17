import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Eye, MessageCircle, Heart, BookOpen, Share2, ArrowLeft } from 'lucide-react'
import { MarkdownContent } from '@/components/markdown-content'
import { formatDate } from '@/lib/date'
import TableOfContents from '@/components/table-of-contents'
import ReadingProgress from '@/components/reading-progress'
import BackToTop from '@/components/back-to-top'
import { RelatedPosts } from '@/components/related-posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { prisma } from '@/lib/prisma'

// 定义接口以增强类型安全
interface Post {
  id: string;
  slug: string;
  title: string;
  publishedAt: Date | string | null;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  views?: number;
  author: { id: string; name: string | null; image?: string | null; bio?: string | null };
  category?: { id: string; name: string; slug: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
  _count: { comments: number; likes: number };
  comments: any[];
  readTime?: number;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          where: {
            parentId: null
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    if (!post) {
      // 如果用 slug 没找到，尝试用 id 查找
      const postById = await prisma.post.findUnique({
        where: {
          id: slug,
          status: 'PUBLISHED'
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          },
          comments: {
            where: {
              parentId: null
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              },
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    }
                  }
                },
                orderBy: {
                  createdAt: 'asc'
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      })
      
      return postById as unknown as Post | null
    }

    return post as unknown as Post | null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(categoryId?: string, currentPostId?: string) {
  if (!categoryId) return [];
  try {
    const posts = await prisma.post.findMany({
      where: {
        categoryId,
        id: { not: currentPostId },
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
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })
    return posts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category?.id, post.id);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-background">
      <ReadingProgress />

      <div className="container mx-auto px-4 py-6 lg:py-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/posts" 
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            返回文章列表
          </Link>
          
          <Button variant="ghost" size="sm" className="h-8 rounded-full gap-2 text-muted-foreground text-xs">
            <Share2 className="w-3.5 h-3.5" />
            分享
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10">
          <main className="xl:col-span-8 space-y-6">
            <article className="glass-morphism rounded-4xl overflow-hidden shadow-2xl border border-border/50 bg-card/30 backdrop-blur-md">
              <header className="relative p-6 md:p-10 lg:p-12">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-30 rounded-t-4xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {post.category && (
                      <Link
                        href={`/category/${post.category.slug}`}
                        className="inline-flex items-center px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary/60" />
                      {post.publishedAt && (
                        <time dateTime={new Date(post.publishedAt).toISOString()}>
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                    </div>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.3] bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                    {post.title}
                  </h1>
                  
                  {post.excerpt && (
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-normal italic border-l-4 border-primary/20 pl-4 py-1">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      {post.author.image && (
                        <div className="relative w-12 h-12 group">
                          <div className="absolute inset-0 bg-primary rounded-full blur opacity-10 group-hover:opacity-20 transition-opacity" />
                          <Image
                            src={post.author.image}
                            alt={post.author.name || '作者'}
                            fill
                            className="rounded-full object-cover ring-2 ring-background shadow-md relative z-10"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm md:text-base">{post.author.name}</p>
                        {post.author.bio && (
                          <p className="text-[10px] text-muted-foreground font-medium">{post.author.bio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 rounded-xl border border-border/20 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">浏览</span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <Eye className="w-3 h-3 text-primary" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                      <div className="w-px h-5 bg-border/50" />
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">评论</span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <MessageCircle className="w-3 h-3 text-primary" />
                          <span>{post._count.comments}</span>
                        </div>
                      </div>
                      <div className="w-px h-5 bg-border/50" />
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">阅读</span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <BookOpen className="w-3 h-3 text-primary" />
                          <span>{Math.ceil(post.content.length / 500)}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {post.coverImage && (
                <div className="relative w-full h-72 md:h-88 lg:h-104 overflow-hidden rounded-t-4xl">
                  <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-50" />
                  </div>
                </div>
              )}

              <div className="px-6 md:px-10 lg:px-12 pb-10 lg:pb-12">
                <MarkdownContent 
                  content={post.content} 
                />

                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border/50">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                      <span className="w-6 h-0.5 bg-primary rounded-full" />
                      文章标签
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((item) => (
                        <Link
                          key={item.tag.id}
                          href={`/tag/${item.tag.slug}`}
                          className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all duration-300"
                        >
                          #{item.tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-4">
                <RelatedPosts posts={relatedPosts as any} />
              </div>
            )}

            {/* 评论区 */}
            <div className="glass-morphism rounded-4xl p-6 md:p-10 shadow-2xl border border-border/50 bg-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg md:text-xl font-black flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  全部评论
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {post._count.comments}
                  </span>
                </h3>
                <Button variant="outline" size="sm" className="h-9 rounded-full font-bold text-xs">
                  发表评论
                </Button>
              </div>
              
              {post.comments.length === 0 ? (
                <div className="w-full rounded-3xl bg-muted/50 p-4">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-muted-foreground text-sm font-bold">暂无评论</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="p-5 md:p-6 bg-muted/10 rounded-2xl border border-border/20 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start gap-4">
                        {comment.author.image && (
                          <div className="relative w-10 h-10 shrink-0">
                            <Image
                              src={comment.author.image}
                              alt={comment.author.name}
                              fill
                              className="rounded-full object-cover shadow-sm"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <p className="font-bold text-xs md:text-sm">{comment.author.name}</p>
                              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{formatDate(comment.createdAt)}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 px-2.5 rounded-full text-[9px] font-bold">回复</Button>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <aside className="xl:col-span-4 space-y-6">
            <div className="sticky top-20 space-y-6">
              <TableOfContents content={post.content} />
              
              {/* Author Card in Sidebar */}
              <Card className="rounded-3xl overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-md">
                <div className="h-20 bg-linear-to-br from-primary/20 to-secondary/20" />
                <CardContent className="relative pt-0 px-5 pb-6">
                  <div className="flex flex-col items-center -mt-10 text-center space-y-3">
                    {post.author.image && (
                      <div className="relative w-20 h-20 ring-4 ring-background rounded-full shadow-xl overflow-hidden">
                        <Image
                          src={post.author.image}
                          alt={post.author.name || '作者'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base">{post.author.name}</h4>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">本文作者</p>
                    </div>
                    {post.author.bio && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic">
                        "{post.author.bio}"
                      </p>
                    )}
                    <div className="pt-3 flex gap-2 w-full">
                      <Button size="sm" className="flex-1 h-8 rounded-full font-bold shadow-lg shadow-primary/20 text-xs">关注作者</Button>
                      <Button size="sm" variant="outline" className="h-8 rounded-full font-bold text-xs">主页</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
      
      <BackToTop />
    </div>
  )
}