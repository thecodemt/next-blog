'use client'

import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

/**
 * 安全的 Markdown 内容渲染组件
 * 使用 react-markdown + react-syntax-highlighter 技术栈
 * 天然防御 XSS 攻击，符合 React 渲染模式
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
      
      // 代码块 - 使用 react-syntax-highlighter
      pre: ({ children }: any) => <>{children}</>,
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''
        const codeString = String(children).replace(/\n$/, '')
        const isCopied = copiedCode === codeString

        if (!inline && language) {
          return (
            <div className="relative group my-6 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/50 shadow-lg">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(codeString)}
                  className="h-7 px-2 text-[10px] gap-1.5 shadow-md backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-white/10"
                >
                  {isCopied ? <><Check className="w-3 h-3" /> 已复制</> : <><Copy className="w-3 h-3" /> 复制</>}
                </Button>
              </div>
              <SyntaxHighlighter
                style={{
                  // 只保留oneDark的颜色方案，移除所有背景相关样式
                  ...Object.fromEntries(
                    Object.entries(oneDark).filter(([key, value]) => {
                      // 保留颜色相关的样式，但排除背景
                      if (typeof value === 'object' && value !== null) {
                        return !key.includes('pre') && !key.includes('code')
                      }
                      return true
                    })
                  ),
                  'pre[class*="language-"]': {
                    color: oneDark['pre[class*="language-"]']?.color || '#d4d4d4',
                    margin: 0,
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    overflow: 'auto',
                  },
                  'code[class*="language-"]': {
                    color: 'inherit',
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  },
                  // 保留语法高亮颜色
                  ...Object.fromEntries(
                    Object.entries(oneDark).filter(([key]) => 
                      key.includes('.token') || 
                      key.includes('.keyword') || 
                      key.includes('.string') || 
                      key.includes('.comment') || 
                      key.includes('.function') ||
                      key.includes('.number') ||
                      key.includes('.operator') ||
                      key.includes('.class')
                    )
                  ),
                }}
                language={language}
                PreTag="div"
                className="text-[14px] leading-relaxed"
                customStyle={{
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  padding: '1rem',
                  margin: 0,
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          )
        }

        // 行内代码
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-border/40 text-foreground" {...props}>
            {children}
          </code>
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
        remarkPlugins={[remarkGfm]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

