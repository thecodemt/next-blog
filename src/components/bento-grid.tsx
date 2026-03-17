'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Code, 
  Github, 
  Twitter, 
  BookOpen, 
  Zap, 
  Coffee,
  ExternalLink,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  postsCount: number
  categoriesCount: number
}

export function BentoGrid({ postsCount, categoriesCount }: BentoGridProps) {
  const [githubStats, setGithubStats] = useState({ stars: 0, followers: 0 })

  // Mock GitHub stats - in real app, fetch from GitHub API
  useEffect(() => {
    setGithubStats({ stars: 1234, followers: 567 })
  }, [])

  const techStack = [
    { name: 'React', icon: '⚛️', level: 90 },
    { name: 'Next.js', icon: '▲', level: 88 },
    { name: 'TypeScript', icon: 'TS', level: 85 },
    { name: 'Node.js', icon: '🟢', level: 82 },
    { name: 'Rust', icon: '🦀', level: 75 },
    { name: 'Tailwind', icon: '🌊', level: 92 }
  ]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">状态概览</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
          
          {/* Tech Stack Card */}
          <Card className="md:col-span-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">技术栈</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {techStack.map((tech) => (
                  <div 
                    key={tech.name}
                    className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-2xl mb-1">{tech.icon}</div>
                    <div className="text-xs font-medium">{tech.name}</div>
                    <div className="text-xs text-muted-foreground">{tech.level}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="md:col-span-3 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="flex items-center justify-center h-full min-h-30">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{postsCount}</div>
                <div className="text-sm text-muted-foreground">篇文章</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="flex items-center justify-center h-full min-h-30">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{categoriesCount}</div>
                <div className="text-sm text-muted-foreground">个分类</div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Stats */}
          <Card className="md:col-span-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <h3 className="text-lg font-semibold">GitHub 动态</h3>
                <Badge variant="secondary" className="text-xs">活跃</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">⭐ {githubStats.stars}</div>
                  <div className="text-sm text-muted-foreground">Stars</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">👥 {githubStats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    查看贡献图 <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="md:col-span-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">当前状态</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <div className="font-medium text-sm">正在开发</div>
                    <div className="text-xs text-muted-foreground">个人博客系统 v2.0</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">正在阅读</div>
                    <div className="text-xs text-muted-foreground">《设计心理学》- 第3章</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">学习目标</div>
                    <div className="text-xs text-muted-foreground">Rust 系统编程</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
