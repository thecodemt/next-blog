'use client'

import { motion } from 'framer-motion'

export function MeshGradientBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 微弱的色彩喷雾背景 */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20" />
      
      {/* 漂浮的彩色气泡 */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      
      {/* 极淡的网格纹理 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  )
}
