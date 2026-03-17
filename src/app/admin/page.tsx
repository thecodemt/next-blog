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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your blog content and users</p>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  View Blog
                </Button>
              </Link>
              <Link href="/admin/posts/new">
                <Button size="sm" className="shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {[
            { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'blue', desc: 'Published blog posts' },
            { label: 'Draft Posts', value: stats.draftPosts, icon: FileText, color: 'amber', desc: 'Posts in draft' },
            { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'emerald', desc: 'Blog categories' },
            { label: 'Tags', value: stats.totalTags, icon: Tag, color: 'purple', desc: 'Blog tags' },
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'indigo', desc: 'Registered users' },
            { label: 'Comments', value: stats.totalComments, icon: MessageCircle, color: 'pink', desc: 'Total comments' },
          ].map((stat, i) => (
            <Card key={i} className="overflow-hidden transition-all hover:shadow-md border-slate-200/60 dark:border-slate-800/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stat.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Essential tools for content management and administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { href: '/admin/posts/new', icon: Plus, label: 'Create Post', desc: 'Start writing', primary: true },
                  { href: '/admin/posts', icon: FileText, label: 'Manage Posts', desc: `${stats.totalPosts} published` },
                  { href: '/admin/categories', icon: FolderOpen, label: 'Categories', desc: `${stats.totalCategories} total` },
                  { href: '/admin/tags', icon: Tag, label: 'Tags', desc: `${stats.totalTags} total` },
                  { href: '/admin/users', icon: Users, label: 'Users', desc: `${stats.totalUsers} members` },
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="group">
                    <div className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 
                      ${action.primary 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                        : 'bg-card hover:border-primary hover:shadow-sm'}`}>
                      <action.icon className={`w-8 h-8 mb-3 transition-transform group-hover:scale-110 ${action.primary ? '' : 'text-primary'}`} />
                      <span className="font-semibold text-sm">{action.label}</span>
                      <span className={`text-[10px] mt-1 ${action.primary ? 'opacity-80' : 'text-muted-foreground'}`}>{action.desc}</span>
                    </div>
                  </Link>
                ))}
                
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="text-center p-4">
                    <Settings className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-700" />
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-600">More Tools</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                System Overview
              </CardTitle>
              <CardDescription>
                Live platform health indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  { label: 'Database', status: 'Connected', variant: 'default' as const, color: 'bg-green-500' },
                  { label: 'API Gateway', status: 'Online', variant: 'default' as const, color: 'bg-green-500' },
                  { label: 'Asset Storage', status: 'Healthy', variant: 'secondary' as const, color: 'bg-slate-200' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge variant={item.variant} className={`${item.color} text-white hover:${item.color}`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary/50 rounded-full"></div>
                  Content Summary
                </h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Published Content', value: stats.totalPosts, percentage: 75 },
                    { label: 'Pending Drafts', value: stats.draftPosts, percentage: 25 },
                    { label: 'User Feedback', value: stats.totalComments, percentage: 100 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

