import { Metadata } from 'next'
import Image from 'next/image'
import { Github, Twitter, Mail, Code, Rocket, Heart, Coffee, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '关于 | Modern Blog',
  description: '了解更多关于 Modern Blog 的信息，以及它背后的技术栈和愿景。',
}

export default function AboutPage() {
  const stats = [
    { label: '项目启动', value: '2024', icon: Rocket },
    { label: '技术栈', value: 'Next.js 15', icon: Code },
    { label: '全球用户', value: '10k+', icon: Globe },
    { label: '开源精神', value: '100%', icon: Heart },
  ]

  const technologies = [
    { name: 'Next.js 15', description: 'React 框架，提供极速的 SSR 和静态生成体验。' },
    { name: 'TypeScript', description: '类型安全，提升代码质量。' },
    { name: 'Tailwind CSS v4', description: '现代化的原子类 CSS 框架。' },
    { name: 'Prisma & PG', description: '可靠的数据持久化方案。' },
    { name: 'NextAuth.js', description: '灵活的身份验证系统。' },
    { name: 'Lucide Icons', description: '美观且一致的图标库。' },
  ]

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section - Integrated Hero & Stats */}
        <section className="pt-12 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gradient">
            关于 Modern Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            致力于分享高质量技术洞见和生活思考的现代化博客。
            通过优秀的设计与前沿技术，产生最纯粹的内容表达。
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-morphism p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold leading-tight">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                我们的故事
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                <p>
                  Modern Blog 诞生于一个简单的想法：<strong>构建一个既美观又实用的全栈博客系统</strong>。
                  在信息爆炸的时代，内容创作者需要纯净的高效空间，读者则需要流畅的无干扰环境。
                </p>
                <p>
                  我们不满足于现状，持续探索 Web 技术的边界。从响应式布局到 Server Components，
                  始终坚持使用最新的技术栈驱动每一次点击。
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="rounded-full px-6">加入我们</Button>
                <Button size="sm" variant="outline" className="rounded-full group">
                  <Coffee className="w-3.5 h-3.5 mr-2 group-hover:text-amber-600" />
                  请喝咖啡
                </Button>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                技术驱动核心
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {technologies.map((tech) => (
                  <div key={tech.name} className="group border-l-2 border-slate-100 dark:border-slate-800 pl-4 hover:border-primary transition-colors">
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tech.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Visual Column */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl glass-morphism p-2">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/10 mix-blend-overlay" />
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-2xl border border-white/20 dark:border-slate-800/50">
                <Code className="w-16 h-16 text-slate-300 dark:text-slate-700 opacity-40" />
              </div>
            </div>

            <section className="glass-morphism rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-800/50">
              <h3 className="font-bold text-lg mb-4">保持联系</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                欢迎提供建议、探讨合作或简单打个招呼。
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl h-10 px-4 text-sm group">
                  <Github className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                  GitHub
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-10 px-4 text-sm group">
                  <Twitter className="w-4 h-4 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                  Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-10 px-4 text-sm group">
                  <Mail className="w-4 h-4 mr-3 text-rose-500 group-hover:scale-110 transition-transform" />
                  Email Me
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
