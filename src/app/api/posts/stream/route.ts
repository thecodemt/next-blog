import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const stream = new ReadableStream({
    start(controller) {
      // 发送初始数据
      const sendInitialData = async () => {
        try {
          const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            include: {
              author: { select: { id: true, name: true, image: true } },
              category: true,
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true } }
            },
            orderBy: { publishedAt: 'desc' }
          })
          
          controller.enqueue(`data: ${JSON.stringify(posts)}\n\n`)
        } catch (error) {
          console.error('Error fetching posts:', error)
        }
      }

      // 定期检查数据更新
      const interval = setInterval(async () => {
        try {
          const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            include: {
              author: { select: { id: true, name: true, image: true } },
              category: true,
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true } }
            },
            orderBy: { publishedAt: 'desc' }
          })
          
          controller.enqueue(`data: ${JSON.stringify(posts)}\n\n`)
        } catch (error) {
          console.error('Error fetching posts:', error)
        }
      }, 10000) // 每10秒检查一次

      // 发送初始数据
      sendInitialData()

      // 清理函数
      return () => {
        clearInterval(interval)
        controller.close()
      }
    }
  })

  return new Response(stream, { headers })
}
