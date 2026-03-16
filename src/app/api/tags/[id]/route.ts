import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const { name, slug } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // 检查名称或 slug 是否与其他标签冲突
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        AND: [
          { id: { not: resolvedParams.id } },
          {
            OR: [
              { name },
              { slug: slug || name.toLowerCase().replace(/\s+/g, '-') }
            ]
          }
        ]
      }
    })

    if (duplicateTag) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 400 }
      )
    }

    const updatedTag = await prisma.tag.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-')
      }
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // 检查是否有关联的文章
    if (existingTag._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag with associated posts' },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
