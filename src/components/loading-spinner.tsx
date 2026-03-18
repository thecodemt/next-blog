'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <motion.div
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}
