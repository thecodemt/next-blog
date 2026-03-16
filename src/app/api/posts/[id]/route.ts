import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('Looking for post with slug:', resolvedParams.id)
    
    const post = await prisma.post.findUnique({
      where: {
        slug: resolvedParams.id,  // 改为使用 slug 查询
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          where: {
            parentId: null
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    console.log('Found post:', post ? 'YES' : 'NO')
    
    if (!post) {
      // 如果用 slug 没找到，尝试用 id 查找
      console.log('Trying to find by id instead...')
      const postById = await prisma.post.findUnique({
        where: {
          id: resolvedParams.id,
          status: 'PUBLISHED'
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          },
          comments: {
            where: {
              parentId: null
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              },
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    }
                  }
                },
                orderBy: {
                  createdAt: 'asc'
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      })
      
      console.log('Found post by id:', postById ? 'YES' : 'NO')
      
      if (postById) {
        return NextResponse.json(postById)
      }
      
      return NextResponse.json(
        { error: 'Post not found', slug: resolvedParams.id },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params

    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { title, slug, content, excerpt, coverImage, categoryId, tags, status, seoTitle, seoDescription, ogImage } = await request.json()

    const updatedPost = await prisma.post.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        categoryId,
        status,
        seoTitle,
        seoDescription,
        ogImage,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
        tags: {
          deleteMany: {},
          create: tags?.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          })) || []
        }
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
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
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
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params

    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
