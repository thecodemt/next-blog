'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300
      setIsVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2">
      {/* 提示文字 */}
      <div 
        className={`bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        返回顶部
      </div>
      
      {/* 按钮 */}
      <Button
        onClick={scrollToTop}
        size="lg"
        className="w-12 h-12 rounded-full shadow-xl bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border border-primary/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-2xl group relative overflow-hidden"
        aria-label="返回顶部"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 图标容器 */}
        <div className="relative flex items-center justify-center">
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" />
          <ChevronUp className="w-3 h-3 absolute -top-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1" />
        </div>
        
        {/* 光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
      </Button>
    </div>
  )
}
