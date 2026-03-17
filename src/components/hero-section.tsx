'use client'

import { User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary)/10,transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar with Status */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
                <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 text-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Full-Stack Developer & Content Creator
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="block mb-2">
                构建数字世界的
                <span className="block bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  工匠
                </span>
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-normal">
                分享技术与生活
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            专注于现代 Web 开发，热衷于探索前沿技术，通过写作分享实践经验。
            从 React 到 Rust，从前端到后端，构建优雅的数字解决方案。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group text-lg px-8">
              查看作品集
              <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              订阅周刊
            </Button>
          </div>

          {/* Current Status */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              正在开发新项目
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              正在阅读《设计心理学》
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
