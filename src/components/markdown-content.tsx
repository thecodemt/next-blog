'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import 'highlight.js/styles/github-dark.css'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = "prose prose-base md:prose-lg max-w-none" }: MarkdownContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} className="text-xl md:text-2xl font-bold mt-8 mb-4 first:mt-0 scroll-mt-20">
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} className="text-lg md:text-xl font-bold mt-6 mb-3 scroll-mt-20">
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="text-base md:text-lg font-bold mt-5 mb-2.5 scroll-mt-20">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-left last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-primary/30 bg-muted/20 pl-4 py-2 my-4 text-muted-foreground italic rounded-r-lg text-sm">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className?.includes('language-')
            
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-border/40">
                  {children}
                </code>
              )
            }
            
            const codeString = String(children).replace(/\n$/, '')
            
            return (
              <div className="relative group my-4">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(codeString)}
                    className="h-7 px-2 text-[10px]"
                  >
                    {copiedCode === codeString ? '已复制' : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <code className={`hljs ${className || ''} block overflow-x-auto p-3.5 rounded-xl bg-gray-900 text-[13px] leading-normal border border-white/5`}>
                  {children}
                </code>
              </div>
            )
          },
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 hover:decoration-primary/60 transition-all duration-200 inline-flex items-center gap-1"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
              {href?.startsWith('http') && (
                <span className="text-xs opacity-60">↗</span>
              )}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="my-6">
              <img 
                src={src} 
                alt={alt || ''}
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
                loading="lazy"
              />
              {alt && (
                <p className="text-center text-sm text-muted-foreground mt-2 italic">
                  {alt}
                </p>
              )}
            </div>
          ),
          hr: () => (
            <div className="my-8 relative">
              <hr className="border-border/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background px-3 text-xs text-muted-foreground">•</div>
              </div>
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-border/50">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border/50 px-4 py-3 text-left font-semibold bg-muted/50 text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border/50 px-4 py-3 text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
