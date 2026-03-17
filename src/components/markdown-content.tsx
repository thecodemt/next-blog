'use client'

import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

interface MarkdownContentProps {
  content: string
  className?: string
}

/**
 * 简化后的 Markdown 内容渲染组件
 * 提取了复杂的渲染逻辑，使主组件更清晰
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
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

  // 使用 useMemo 缓存组件定义，避免重复创建
  const components = useMemo(() => {
    // 标题通用渲染函数
    const Heading = (level: number, className: string, showDot = false) => ({ children, id }: any) => {
      const Tag = `h${level}` as any
      return (
        <Tag id={id} className={cn(className, "font-bold mt-8 mb-4 scroll-mt-20")}>
          {showDot && <span className="w-1 h-6 bg-primary rounded-full shrink-0" />}
          {children}
        </Tag>
      )
    }

    return {
      h1: Heading(1, "text-2xl md:text-3xl mb-6 first:mt-0 border-b border-border/30 pb-3"),
      h2: Heading(2, "text-xl md:text-2xl flex items-center gap-2", true),
      h3: Heading(3, "text-lg md:text-xl text-muted-foreground"),
      
      // 文本与列表
      p: ({ children }: any) => <p className="mb-6 leading-relaxed text-justify last:mb-0">{children}</p>,
      ul: ({ children }: any) => <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>,
      ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>,
      li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
      
      // 引用
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/50 bg-linear-to-r from-primary/5 to-transparent pl-6 py-4 my-6 text-muted-foreground italic rounded-r-lg">
        {children}
      </blockquote>
    ),
    
    // 代码块逻辑
    pre: ({ children }: any) => <>{children}</>,
    code: ({ children, className }: any) => {
      // 提取纯文本内容
      const getRawText = (nodes: any): string => {
        if (typeof nodes === 'string') return nodes
        if (Array.isArray(nodes)) return nodes.map(getRawText).join('')
        if (nodes?.props?.children) return getRawText(nodes.props.children)
        return ''
      }
      
      const codeString = getRawText(children)
      
      // 改进的块级代码判断逻辑：
      // 1. 含有 hljs 或 language- 类名 (有注明语言或已被插件识别)
      // 2. 含有换行符 (Markdown 规范中，被三引号包裹的代码块通常会保留换行符，而行内代码不会)
      const isBlock = className?.includes('hljs') || 
                      className?.includes('language-') || 
                      codeString.includes('\n')
      
      if (!isBlock) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-border/40 text-foreground">
            {children}
          </code>
        )
      }
      
      const cleanCodeString = codeString.replace(/\n$/, '')
      const isCopied = copiedCode === cleanCodeString
      
      return (
        <div className="relative group my-6">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyToClipboard(cleanCodeString)}
              className="h-7 px-2 text-[10px] gap-1.5 shadow-md backdrop-blur-sm bg-secondary/90 hover:bg-secondary"
            >
              {isCopied ? <><Check className="w-3 h-3" /> 已复制</> : <><Copy className="w-3 h-3" /> 复制</>}
            </Button>
          </div>
          <pre className="relative rounded-xl overflow-hidden border border-border/20 bg-slate-950 shadow-lg z-10">
            <code className={cn("hljs block overflow-x-auto p-4 text-[13px] leading-relaxed relative z-20 whitespace-pre", className)}>
              {children}
            </code>
          </pre>
        </div>
      )
    },
      
      // 链接与图片
      a: ({ href, children }: any) => {
        const isExternal = href?.startsWith('http')
        return (
          <a 
            href={href} 
            className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 hover:decoration-primary/60 transition-all duration-200 inline-flex items-center gap-1"
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {children}
            {isExternal && <span className="text-xs opacity-60">↗</span>}
          </a>
        )
      },
      img: ({ src, alt }: any) => (
        <div className="my-8 group">
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <img 
              src={src} 
              alt={alt || ''}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {alt && <p className="text-center text-sm text-muted-foreground mt-3 italic font-medium">{alt}</p>}
        </div>
      ),
      
      // 分隔线与表格
      hr: () => (
        <div className="my-12 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/30" /></div>
          <div className="relative bg-background px-4 py-2">
            <div className="w-8 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>
        </div>
      ),
      table: ({ children }: any) => (
        <div className="overflow-x-auto my-8 rounded-xl border border-border/30 shadow-sm">
          <table className="w-full border-collapse">{children}</table>
        </div>
      ),
      th: ({ children }: any) => <th className="border border-border/30 px-4 py-3 text-left font-semibold bg-muted/50 text-sm">{children}</th>,
      td: ({ children }: any) => <td className="border border-border/30 px-4 py-3 text-sm">{children}</td>,
    }
  }, [copiedCode])

  return (
    <div className={cn("prose prose-base md:prose-lg max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeKatex]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

