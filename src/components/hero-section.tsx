'use client'

import { User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar with Status */}
          <div className="mb-10 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500 scale-110" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-primary via-primary/80 to-primary/60 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-primary/80 group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-8 space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Full-Stack Developer & Content Creator
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-tight lg:leading-tight">
              构建数字世界的
              <span className="block mt-2 bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                创意工匠
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              探索技术边界，记录成长点滴
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            致力于构建高性能、易用的现代 Web 应用。
            擅长 React 生态系统、Node.js 及云原生技术栈。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group">
              开始探索
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 hover:bg-muted/50 backdrop-blur-sm transition-all duration-300">
              订阅更新
            </Button>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />, text: "正在开发 Blog v2.0" },
              { icon: "📚", text: "阅读中:《设计心理学》" },
              { icon: "🚀", text: "探索 Rust & WASM" }
            ].map((status, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 transition-colors">
                {status.icon}
                {status.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

