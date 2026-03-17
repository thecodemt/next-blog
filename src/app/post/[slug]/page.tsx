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

// 定义接口以增强类型安全
interface Post {
  id: string;
  slug: string;
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
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedPosts(categorySlug?: string, currentPostSlug?: string) {
  if (!categorySlug) return [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' });
  if (!res.ok) return [];
  const posts = await res.json();
  return posts
    .filter((p: any) => p.category?.slug === categorySlug && (p.slug || p.id) !== currentPostSlug)
    .slice(0, 3);
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category?.slug, slug);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-background">
      <ReadingProgress />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/posts" 
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            返回文章列表
          </Link>
          
          <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground">
            <Share2 className="w-4 h-4" />
            分享文章
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          <main className="xl:col-span-8 space-y-8">
            <article className="glass-morphism rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 bg-card/30 backdrop-blur-md">
              <header className="relative p-8 md:p-12 lg:p-16">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 opacity-40 rounded-t-[2.5rem]" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex flex-wrap items-center gap-4">
                    {post.category && (
                      <Link
                        href={`/category/${post.category.slug}`}
                        className="inline-flex items-center px-5 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary/60" />
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                    {post.title}
                  </h1>
                  
                  {post.excerpt && (
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium italic border-l-4 border-primary/20 pl-6 py-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-5">
                      {post.author.image && (
                        <div className="relative w-16 h-16 group">
                          <div className="absolute inset-0 bg-primary rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                          <Image
                            src={post.author.image}
                            alt={post.author.name}
                            fill
                            className="rounded-full object-cover ring-4 ring-background shadow-xl relative z-10"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-lg">{post.author.name}</p>
                        {post.author.bio && (
                          <p className="text-sm text-muted-foreground font-medium">{post.author.bio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 px-6 py-3 bg-muted/30 rounded-2xl border border-border/30 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">浏览</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <Eye className="w-4 h-4 text-primary" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border/50" />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">评论</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <MessageCircle className="w-4 h-4 text-primary" />
                          <span>{post._count.comments}</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border/50" />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">阅读</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>{Math.ceil(post.content.length / 500)}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {post.coverImage && (
                <div className="relative h-[25rem] md:h-[30rem] lg:h-[35rem] w-full overflow-hidden group px-8 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16">
                  <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              )}

              <div className="px-8 md:px-12 lg:px-16 pb-12 lg:pb-16">
                <MarkdownContent 
                  content={post.content} 
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10" 
                />

                {post.tags.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-border/50">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-widest text-muted-foreground">
                      <span className="w-8 h-1 bg-primary rounded-full" />
                      文章标签
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((item) => (
                        <Link
                          key={item.tag.id}
                          href={`/tag/${item.tag.slug}`}
                          className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all duration-300"
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
            <RelatedPosts posts={relatedPosts} />

            {/* 评论区 */}
            <div className="glass-morphism rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-border/50 bg-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  全部评论
                  <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {post._count.comments}
                  </span>
                </h3>
                <Button variant="outline" className="rounded-full font-bold">
                  发表评论
                </Button>
              </div>
              
              {post.comments.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
                  <p className="text-muted-foreground font-bold text-lg">暂无评论，来做第一个评论的人吧！</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="p-8 bg-muted/20 rounded-3xl border border-border/30 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-5">
                        {comment.author.image && (
                          <div className="relative w-14 h-14 shrink-0">
                            <Image
                              src={comment.author.image}
                              alt={comment.author.name}
                              fill
                              className="rounded-full object-cover shadow-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-base">{comment.author.name}</p>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{formatDate(comment.createdAt)}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold">回复</Button>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <aside className="xl:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <TableOfContents content={post.content} />
              
              {/* Author Card in Sidebar */}
              <Card className="rounded-[2rem] overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-md">
                <div className="h-24 bg-linear-to-br from-primary/20 to-secondary/20" />
                <CardContent className="relative pt-0 px-6 pb-8">
                  <div className="flex flex-col items-center -mt-12 text-center space-y-4">
                    {post.author.image && (
                      <div className="relative w-24 h-24 ring-4 ring-background rounded-full shadow-2xl overflow-hidden">
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-black text-xl">{post.author.name}</h4>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">本文作者</p>
                    </div>
                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                        "{post.author.bio}"
                      </p>
                    )}
                    <div className="pt-4 flex gap-2 w-full">
                      <Button className="flex-1 rounded-full font-bold shadow-lg shadow-primary/20">关注作者</Button>
                      <Button variant="outline" className="rounded-full font-bold">主页</Button>
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