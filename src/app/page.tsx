import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Heart, MessageCircle, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { AuthHeader } from '@/components/auth-header'

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

export default async function Home() {
  const posts = await getPosts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">Modern Blog</h1>
            </div>
            <AuthHeader />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {category._count.posts} posts
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  {post.coverImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </CardHeader>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
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
                  
                  <Link href={`/post/${post.slug}`}>
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  {post.excerpt && (
                    <CardDescription className="mt-2">
                      {post.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((postTag: any) => (
                        <Link
                          key={postTag.tag.id}
                          href={`/tag/${postTag.tag.slug}`}
                          className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs hover:bg-secondary/80 transition-colors"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {postTag.tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post._count.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post._count.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
