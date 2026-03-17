'use client'

import React from 'react'
import { Code2, Database, BarChart3, Cpu, Globe, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TechItemProps {
  name: string
  color?: string
}

function TechTag({ name, color }: TechItemProps) {
  return (
    <div 
      className={cn(
        "group relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-default overflow-hidden",
        "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800",
        "hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 active:scale-95 shadow-xs hover:shadow-md"
      )}
    >
      {/* 悬停时的色彩光晕效果 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-r from-blue-500 to-indigo-500 transition-opacity" />
      <span className="relative z-10 uppercase tracking-tighter">{name}</span>
    </div>
  )
}

export function TechStack() {
  const groups = [
    {
      title: "Frontend",
      description: "Modern UI & Experience",
      icon: <Code2 className="w-5 h-5" />,
      items: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion"],
      color: "blue"
    },
    {
      title: "Backend",
      description: "Scalable Systems & Data",
      icon: <Database className="w-5 h-5" />,
      items: ["Go", "Node.js", "Prisma", "PostgreSQL", "Redis", "Docker"],
      color: "emerald"
    },
    {
      title: "Research",
      description: "Quant & Data Intelligence",
      icon: <BarChart3 className="w-5 h-5" />,
      items: ["Quant", "Alpha Research", "Python", "Pandas", "Scikit-Learn"],
      color: "amber"
    }
  ]

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          技术栈
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">
          常用工具与核心能力集
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {groups.map((group, groupIndex) => (
          <div 
            key={group.title} 
            className={cn(
              "space-y-6 p-6 rounded-2xl transition-all duration-500",
              "bg-slate-50/30 dark:bg-slate-900/20 border border-transparent hover:border-slate-100 dark:hover:border-slate-800",
              "animate-in fade-in slide-in-from-bottom-4 duration-700",
              `delay-[${600 + groupIndex * 150}ms]`
            )}
          >
            {/* 组标题与图标 */}
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-110",
                "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700",
                group.color === 'blue' && "text-blue-500",
                group.color === 'emerald' && "text-emerald-500",
                group.color === 'amber' && "text-amber-500"
              )}>
                {group.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{group.title}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-bold">
                  {group.description}
                </p>
              </div>
            </div>

            {/* 标签云 */}
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <TechTag key={item} name={item} color={group.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部装饰性状态 */}
      <div className="pt-4 flex items-center justify-center gap-6 opacity-40">
        <div className="h-px grow bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
          <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Digital Nomad</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Full Stack</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> High Performance</span>
        </div>
        <div className="h-px grow bg-linear-to-r from-slate-200 dark:from-slate-800 via-slate-200 dark:via-slate-800 to-transparent" />
      </div>
    </section>
  )
}
