import { Metadata } from 'next'
import Image from 'next/image'
import { Github, Twitter, Mail, Code, Rocket, Heart, Coffee, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '关于我 | 个人博客',
  description: '了解更多关于我的故事、技术热情和博客创作历程。',
}

export default function AboutPage() {
  const personalStats = [
    { label: '博客文章', value: '50+', icon: Code },
    { label: '代码提交', value: '1.2k+', icon: Github },
    { label: '咖啡因', value: '∞', icon: Coffee },
    { label: '热爱度', value: '100%', icon: Heart },
  ]

  const interests = [
    { name: '前端开发', description: 'React、Next.js、TypeScript，构建优雅的用户界面' },
    { name: '全栈架构', description: '探索现代Web应用的完整解决方案' },
    { name: '开源贡献', description: '相信分享的力量，参与开源社区建设' },
    { name: '技术写作', description: '将复杂的技术概念用简单的方式表达' },
    { name: '用户体验', description: '追求极致的用户体验和界面设计' },
    { name: '持续学习', description: '保持好奇心，永远在学习的路上' },
  ]

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section - Integrated Hero & Stats */}
        <section className="pt-12 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gradient">
            关于我
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            热爱技术、喜欢分享的全栈开发者。
            在这里记录学习历程、分享技术见解，希望能帮助到更多同行者。
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {personalStats.map((stat) => {
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
                我的故事
              </h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                <p>
                  你好！我是一名<strong>热爱技术的全栈开发者</strong>。
                  从前端到后端，从设计到部署，我喜欢探索技术的每一个角落。
                </p>
                <p>
                  这个博客是我记录学习、分享思考的地方。我相信<strong>知识分享的力量</strong>，
                  希望通过文字帮助更多人成长，也在这里记录自己的技术成长轨迹。
                </p>
                <p>
                  当不写代码的时候，你可能会发现我在喝咖啡、阅读技术书籍，
                  或者参与开源项目的讨论。永远保持好奇心，永远在学习的路上。
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="rounded-full px-6">阅读博客</Button>
                <Button size="sm" variant="outline" className="rounded-full group">
                  <Mail className="w-3.5 h-3.5 mr-2 group-hover:text-rose-600" />
                  联系我
                </Button>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                技术兴趣
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {interests.map((interest) => (
                  <div key={interest.name} className="group border-l-2 border-slate-100 dark:border-slate-800 pl-4 hover:border-primary transition-colors">
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary">{interest.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{interest.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Visual Column */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl glass-morphism p-2 group">
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" 
                  style={{ animationDuration: '8s' }} 
                />
                <div 
                  className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
                  style={{ animationDuration: '12s' }} 
                />
              </div>
              
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/20 dark:border-slate-800/50 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-3 group-hover:text-primary transition-colors">
                  Developer Status
                </div>
                <div className="font-mono text-lg font-black tracking-tighter text-gradient group-hover:scale-110 transition-transform duration-500">
                  CODING_BLOG_v2.0
                </div>
                <div className="mt-4 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  🚀 正在构建下一个项目
                </div>
              </div>
            </div>

            <section className="glass-morphism rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-800/50">
              <h3 className="font-bold text-lg mb-4">与我联系</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                欢迎交流技术、分享想法，或者只是打个招呼！
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
