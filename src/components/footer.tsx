'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: '站点导航',
      links: [
        { name: '首页', href: '/' },
        { name: '所有文章', href: '/posts' },
        { name: '关于我', href: '/about' },
      ],
    },
    {
      title: '社交媒体',
      links: [
        { name: 'GitHub', href: 'https://github.com', icon: Github },
        { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
        { name: 'Email', href: 'mailto:hello@example.com', icon: Mail },
      ],
    },
    {
      title: '友情链接',
      links: [
        { name: 'Next.js', href: 'https://nextjs.org' },
        { name: 'Tailwind CSS', href: 'https://tailwindcss.com' },
        { name: 'Vercel', href: 'https://vercel.com' },
      ],
    },
  ]

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative z-10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-base">B</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Modern Blog
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              分享技术洞见与生活思考。致力于构建更美观、更实用的 Web 体验。
            </p>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Modern Blog.</span>
            <span className="hidden md:inline">Built with</span>
            <Link href="https://nextjs.org" className="hover:text-primary transition-colors font-medium">Next.js</Link>
            <span>&</span>
            <Link href="https://tailwindcss.com" className="hover:text-primary transition-colors font-medium">Tailwind</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">服务条款</Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-tighter">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
