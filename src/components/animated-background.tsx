'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 动态渐变背景 */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* 跟随鼠标的光晕效果 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
          mass: 2,
        }}
      />
      
      {/* 浮动的几何形状 */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-lg"
        animate={{
          rotate: 360,
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 border border-white/10 rounded-full"
        animate={{
          rotate: -360,
          x: [0, 30, 0],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
    </div>
  )
}
