'use client'

import React, { useState, useEffect } from 'react'
import { Github, Twitter, Terminal, MapPin, Zap, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden py-20">
      {/* 2. 🎨 几何艺术背景 (Abstract Geometry) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* 动态聚光灯效果 */}
        <div 
          className="pointer-events-none absolute -inset-[100px] opacity-30 transition-transform duration-300 ease-out"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
          }}
        />

        {/* 模糊渐变光圈 */}
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse delay-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-10">
          {/* Top: 巨大的加粗标题 */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-left-8 duration-1000">
              你好，我是
              <span className="block bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                小马
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
              一名专注全栈开发与
              <span className="relative inline-block group cursor-help text-slate-900 dark:text-slate-100">
                量化研究
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                  Alpha Research & Strategy 📈
                </span>
              </span>
              的开发者。
            </p>
          </div>

          {/* 1. 🟢 动态状态看板 (Status Dashboard) */}
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-16 duration-1000 delay-300">
            {[
              { label: 'Focusing', value: 'Next.js 15 & Go', icon: <Zap className="w-3 h-3 text-amber-500" /> },
              { label: 'Project', value: 'Blog v2.0', icon: <Activity className="w-3 h-3 text-emerald-500" /> },
              { label: 'Location', value: 'Remote / Beijing', icon: <MapPin className="w-3 h-3 text-blue-500" /> },
            ].map((status, i) => (
              <div 
                key={i}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] font-mono shadow-sm group hover:border-blue-500/30 transition-colors"
              >
                {status.icon}
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{status.label}:</span>
                <span className="text-slate-600 dark:text-slate-300">{status.value}</span>
              </div>
            ))}
          </div>

          {/* 互动链接 */}
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-20 duration-1000 delay-500">
            <Link 
              href="https://github.com" 
              target="_blank"
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 shadow-sm"
            >
              <Github className="w-6 h-6" />
            </Link>
            <Link 
              href="https://twitter.com" 
              target="_blank"
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-400 hover:scale-110 active:scale-95 shadow-sm"
            >
              <Twitter className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* 3. ⌨️ 交互式代码片段 (Interactive Snippet) */}
        <div className="hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-700">
          <div className="relative group">
            {/* 窗口装饰阴影 */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/30 dark:bg-slate-800/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 dark:bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 dark:bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 dark:bg-emerald-500/40" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <Terminal className="w-3 h-3" />
                  <span>research_alpha.ts</span>
                </div>
              </div>

              {/* Code Area */}
              <div className="p-6 text-[13px] font-mono leading-relaxed overflow-hidden">
                <div className="space-y-1">
                  <p className="text-blue-500 dark:text-blue-400 italic">// Quant Research Algorithm</p>
                  <p><span className="text-purple-500">interface</span> <span className="text-blue-500">AlphaSignal</span> {'{'}</p>
                  <p className="pl-4"><span className="text-slate-500">ticker:</span> <span className="text-amber-500">string</span>;</p>
                  <p className="pl-4"><span className="text-slate-500">score:</span> <span className="text-amber-500">number</span>;</p>
                  <p className="pl-4"><span className="text-slate-500">timestamp:</span> <span className="text-amber-500">Date</span>;</p>
                  <p>{'}'}</p>
                  <p>&nbsp;</p>
                  <p><span className="text-purple-500">function</span> <span className="text-emerald-500">calculateAlpha</span>(data: MarketData) {'{'}</p>
                  <p className="pl-4"><span className="text-purple-500">return</span> data.returns.reduce((acc, curr) ={'>'} {'{'}</p>
                  <p className="pl-8"><span className="text-purple-500">return</span> acc + (curr - data.benchmark);</p>
                  <p className="pl-4">{'}'}, <span className="text-amber-500">0</span>);</p>
                  <p>{'}'}</p>
                </div>
              </div>

              {/* Window Footer */}
              <div className="px-4 py-2 bg-blue-600/5 dark:bg-blue-600/10 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest animate-pulse">Running</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 bg-blue-600/40 dark:bg-blue-400/40 rounded-full" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
