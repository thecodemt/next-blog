import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 获取最新的文章数据
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: posts,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error refreshing posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh posts' 
      },
      { status: 500 }
    )
  }
}
