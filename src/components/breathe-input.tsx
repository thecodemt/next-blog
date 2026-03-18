'use client'

import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BreatheInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const BreatheInput = forwardRef<HTMLInputElement, BreatheInputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className="block text-[10px] uppercase tracking-widest font-medium text-slate-600 dark:text-slate-400 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700"
            animate={{
              backgroundColor: isFocused ? 'rgb(99, 102, 241)' : 'rgb(203, 213, 225)',
              scale: isFocused ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          />
          <input
            type={type}
            id={id}
            className={cn(
              "w-full px-0 py-3 bg-transparent border-0 rounded-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200",
              isFocused && "bg-slate-50/50 dark:bg-slate-800/30",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
      </div>
    )
  }
)

BreatheInput.displayName = "BreatheInput"

export { BreatheInput }
