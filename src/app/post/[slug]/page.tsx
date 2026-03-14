import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, Heart, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {post.category && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="hover:text-primary"
                >
                  {post.category.name}
                </Link>
              )}
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {post.author.image && (
                    <div className="relative w-10 h-10">
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post._count.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post._count.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag: any) => (
                  <Link
                    key={postTag.tag.id}
                    href={`/tag/${postTag.tag.slug}`}
                    className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors"
                  >
                    #{postTag.tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-6">Comments ({post._count.comments})</h3>
            
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment: any) => (
                  <Card key={comment.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        {comment.author.image && (
                          <div className="relative w-8 h-8">
                            <Image
                              src={comment.author.image}
                              alt={comment.author.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{comment.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm">{comment.content}</p>
                      
                      {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-3 pl-8 border-l-2 border-border">
                              {reply.author.image && (
                                <div className="relative w-6 h-6 flex-shrink-0">
                                  <Image
                                    src={reply.author.image}
                                    alt={reply.author.name}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-xs">{reply.author.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-xs">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}
