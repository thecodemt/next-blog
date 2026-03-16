import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Users, Settings, MessageCircle, FolderOpen, Tag } from 'lucide-react'

async function getAdminStats() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  try {
    // 直接使用 Prisma 查询数据库，避免 HTTP 请求和认证问题
    const [
      totalPosts,
      draftPosts,
      totalUsers,
      totalComments,
      totalCategories,
      totalTags
    ] = await Promise.all([
      // 已发布文章数
      prisma.post.count({
        where: { status: 'PUBLISHED' }
      }),
      // 草稿文章数
      prisma.post.count({
        where: { status: 'DRAFT' }
      }),
      // 用户总数
      prisma.user.count(),
      // 评论总数
      prisma.comment.count(),
      // 分类总数
      prisma.category.count(),
      // 标签总数
      prisma.tag.count()
    ])

    return {
      totalPosts,
      draftPosts,
      totalUsers,
      totalComments,
      totalCategories,
      totalTags
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalPosts: 0,
      draftPosts: 0,
      totalUsers: 0,
      totalComments: 0,
      totalCategories: 0,
      totalTags: 0
    }
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">View Blog</Button>
              </Link>
              <Link href="/admin/posts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                Published blog posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftPosts}</div>
              <p className="text-xs text-muted-foreground">
                Posts in draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                Blog categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTags}</div>
              <p className="text-xs text-muted-foreground">
                Blog tags
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <p className="text-xs text-muted-foreground">
                Total comments
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks and content management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/admin/posts/new">
                  <Button className="w-full h-20 flex-col gap-2 hover:bg-primary/90">
                    <Plus className="w-6 h-6" />
                    <span className="font-medium">Create New Post</span>
                    <span className="text-xs opacity-80">Start writing</span>
                  </Button>
                </Link>
                
                <Link href="/admin/posts">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:border-primary">
                    <FileText className="w-6 h-6" />
                    <span className="font-medium">Manage Posts</span>
                    <span className="text-xs text-muted-foreground">Edit content</span>
                  </Button>
                </Link>
                
                <Link href="/admin/categories">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:border-primary">
                    <FolderOpen className="w-6 h-6" />
                    <span className="font-medium">Categories</span>
                    <span className="text-xs text-muted-foreground">{stats.totalCategories} total</span>
                  </Button>
                </Link>
                
                <Link href="/admin/tags">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:border-primary">
                    <Tag className="w-6 h-6" />
                    <span className="font-medium">Tags</span>
                    <span className="text-xs text-muted-foreground">{stats.totalTags} total</span>
                  </Button>
                </Link>
                
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:border-primary">
                    <Users className="w-6 h-6" />
                    <span className="font-medium">Users</span>
                    <span className="text-xs text-muted-foreground">{stats.totalUsers} total</span>
                  </Button>
                </Link>
                
                <div className="border border-dashed border-muted-foreground/20 rounded-lg h-20 flex items-center justify-center">
                  <div className="text-center">
                    <Settings className="w-6 h-6 mx-auto mb-1 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground">More tools</span>
                    <span className="text-xs text-muted-foreground/50">Coming soon</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Status
              </CardTitle>
              <CardDescription>
                Current system overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default" className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <Badge variant="secondary">Normal</Badge>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Content Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium">{stats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drafts</span>
                    <span className="font-medium">{stats.draftPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-medium">{stats.totalComments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
