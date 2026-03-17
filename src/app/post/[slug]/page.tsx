import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Eye, MessageCircle, Heart, BookOpen } from 'lucide-react'
import { MarkdownContent } from '@/components/markdown-content'
import { formatDate } from '@/lib/date'
import TableOfContents from '@/components/table-of-contents'
import ReadingProgress from '@/components/reading-progress'
import BackToTop from '@/components/back-to-top'

// 定义接口以增强类型安全
interface Post {
  title: string;
  publishedAt: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  views?: number;
  author: { name: string; image?: string; bio?: string };
  category?: { name: string; slug: string };
  tags: { tag: { id: string; name: string; slug: string } }[];
  _count: { comments: number; likes: number };
  comments: any[];
}

async function getPost(slug: string): Promise<Post | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // 注意：在服务端组件中使用绝对路径
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. 正确 await params
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background/95 to-background">
      <ReadingProgress />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          <main className="xl:col-span-8">
            <article className="glass-morphism rounded-3xl overflow-hidden shadow-2xl">
              <header className="relative p-6 md:p-8 lg:p-12">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-30 rounded-t-3xl" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
                    {post.category && (
                      <Link
                        href={`/category/${post.category.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight text-gradient">
                    {post.title}
                  </h1>
                  
                  {post.excerpt && (
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 bg-muted/30 rounded-2xl border border-border/30">
                    <div className="flex items-center gap-4">
                      {post.author.image && (
                        <div className="relative w-14 h-14">
                          <Image
                            src={post.author.image}
                            alt={post.author.name}
                            fill
                            className="rounded-full object-cover ring-4 ring-primary/10 shadow-lg"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-base">{post.author.name}</p>
                        {post.author.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{post.author.bio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post._count.comments}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{post._count.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{Math.ceil(post.content.length / 500)} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {post.coverImage && (
                <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden group">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-8 lg:p-12">
                <MarkdownContent 
                  content={post.content} 
                  className="prose prose-lg dark:prose-invert max-w-none" 
                />

                {post.tags.length > 0 && (
                  <div className="mt-12 p-6 bg-muted/20 rounded-2xl border border-border/30">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      文章标签
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((item) => (
                        <Link
                          key={item.tag.id}
                          href={`/tag/${item.tag.slug}`}
                          className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm transition-colors"
                        >
                          #{item.tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* 评论区修复闭合 */}
            <div className="mt-8 glass-morphism rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                评论 ({post._count.comments})
              </h3>
              
              {post.comments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>暂无评论，来做第一个评论的人吧！</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="p-6 bg-muted/20 rounded-2xl border border-border/30">
                      <div className="flex items-start gap-4">
                        {comment.author.image && (
                          <div className="relative w-12 h-12 shrink-0">
                            <Image
                              src={comment.author.image}
                              alt={comment.author.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-sm">{comment.author.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                          </div>
                          <p className="text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <aside className="xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </div>
      
      <BackToTop />
    </div>
  )
}