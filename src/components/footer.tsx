import Link from 'next/link'
import { Github, Twitter, Mail, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: '导航',
      links: [
        { name: '首页', href: '/' },
        { name: '博客', href: '/posts' },
        { name: '关于', href: '/about' },
        { name: '标签', href: '/tags' },
      ],
    },
    {
      title: '内容',
      links: [
        { name: '技术文章', href: '/category/tech' },
        { name: '生活随笔', href: '/category/life' },
        { name: '项目展示', href: '/projects' },
        { name: 'RSS订阅', href: '/rss.xml' },
      ],
    },
    {
      title: '联系',
      links: [
        { name: 'GitHub', href: 'https://github.com', icon: Github },
        { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
        { name: '邮箱', href: 'mailto:hello@example.com', icon: Mail },
      ],
    },
    {
      title: '更多',
      links: [
        { name: '隐私政策', href: '/privacy' },
        { name: '使用条款', href: '/terms' },
        { name: '网站地图', href: '/sitemap' },
        { name: 'RSS', href: '/rss.xml' },
      ],
    },
  ]

  return (
    <footer className="bg-background border-t border-border/60 relative z-10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 max-w-4xl mx-auto">
          {/* Links Sections - 均匀分布的四列布局 */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {'icon' in link && <link.icon className="w-3.5 h-3.5" />}
                      {link.name}
                      {link.href.startsWith('http') && !('icon' in link) && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 opacity-30" />

        {/* Bottom Section - 简洁的版权信息 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <span>© {currentYear} 个人博客</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-xs">用 ❤️ 构建</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="https://github.com" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Github className="w-4 h-4" />
            </Link>
            <Link href="https://twitter.com" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="mailto:hello@example.com" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Mail className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
