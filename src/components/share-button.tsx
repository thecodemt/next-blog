'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  className?: string
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopied(true)
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-8 rounded-full gap-2 text-muted-foreground hover:text-primary transition-all duration-300 ${className}`}
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-500">已复制</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>分享</span>
        </>
      )}
    </Button>
  )
}
