'use client'

import Link from 'next/link'
import { Clock, ArrowRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  publishedAt: string | Date | null
  readTime?: number
  category?: { name: string; slug: string } | null
}

interface LatestPostsProps {
  posts: Post[]
}

export function LatestPosts({ posts: initialPosts }: LatestPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // 手动刷新功能
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/posts/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPosts(result.data)
          setLastUpdate(new Date())
        }
      }
    } catch (error) {
      console.error('Error refreshing posts:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // 监听页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // 定期自动刷新（每5分钟）
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            最新文章
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-600">
            更新于: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        <button
          onClick={handleRefresh}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg",
            "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700",
            "transition-colors duration-200"
          )}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          刷新
        </button>
      </div>

      <div className="space-y-2">
        {posts.map((post, index) => {
          const date = post.publishedAt ? new Date(post.publishedAt) : null
          const year = date ? date.getFullYear() : '----'
          const month = date ? (date.getMonth() + 1).toString().padStart(2, '0') : '--'

          return (
            <Link 
              key={post.id} 
              href={`/post/${post.slug || post.id}`}
              className={cn(
                "group relative block p-4 -mx-4 rounded-2xl transition-all duration-300",
                "hover:bg-slate-50 dark:hover:bg-slate-900/50",
                "animate-in fade-in slide-in-from-bottom-4 duration-700",
                `delay-[${300 + index * 100}ms]`
              )}
            >
              {/* 1. 核心排版：非对称列表 (Asymmetric List) */}
              <div className="grid grid-cols-[80px_1fr_auto] gap-6 items-baseline">
                {/* 左侧：时间线/索引 */}
                <div className="text-sm font-mono text-slate-400 dark:text-slate-600 flex flex-col">
                  <span className="text-xs font-bold">{year}</span>
                  <span className="opacity-60">{month}</span>
                </div>

                {/* 中间：标题与摘要 */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-0.5 duration-300 truncate">
                      {post.title}
                    </h3>
                    {/* B. 阅读成本预估 (Reading Time) */}
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime || 5} min read</span>
                    </div>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 italic font-light group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* 右侧：技术标签 (Tags) */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {post.category && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50">
                      {post.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* A. 幽灵交互效果 (The Ghost Hover) - 视觉微装饰 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-blue-600 dark:bg-blue-400 rounded-full group-hover:h-6 transition-all duration-300" />
            </Link>
          )
        })}
      </div>

      <Link 
        href="/posts" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group px-1"
      >
        查看全部文章
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </section>
  )
}
