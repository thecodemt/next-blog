'use client'

import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([])

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))
    
    const tocItems = matches.map((match, index) => {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      
      return { id, text, level }
    })
    
    setHeadings(tocItems)
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <Card className="bg-linear-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-lg border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          目录
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {headings.map((heading, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(heading.id)}
              className={`
                block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                hover:bg-primary/10 hover:text-primary hover:translate-x-1
                ${heading.level === 1 ? 'font-semibold' : ''}
                ${heading.level === 2 ? 'pl-6' : ''}
                ${heading.level === 3 ? 'pl-9 text-xs' : ''}
                ${heading.level >= 4 ? 'pl-12 text-xs' : ''}
              `}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
