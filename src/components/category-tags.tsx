'use client'

import Link from 'next/link'
import { Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

interface CategoryTagsProps {
  categories: Category[]
}

export function CategoryTags({ categories }: CategoryTagsProps) {
  if (!categories.length) return null

  // Sort by post count and get max for sizing
  const sortedCategories = [...categories].sort((a, b) => (b._count?.posts || 0) - (a._count?.posts || 0))
  const maxCount = Math.max(...categories.map(cat => cat._count?.posts || 0))

  const getTagSize = (count: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-lg px-4 py-2'
    if (ratio > 0.6) return 'text-base px-3 py-2'
    if (ratio > 0.4) return 'text-sm px-3 py-1.5'
    return 'text-sm px-2 py-1'
  }

  const getTagIntensity = (count: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'bg-primary text-primary-foreground'
    if (ratio > 0.6) return 'bg-primary/80 text-primary-foreground'
    if (ratio > 0.4) return 'bg-primary/60 text-primary-foreground'
    return 'bg-primary/40 text-primary-foreground'
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">知识体系</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            探索不同领域的知识版块，从技术深度到生活广度
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">分类标签</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {sortedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    getTagSize(category._count?.posts || 0),
                    getTagIntensity(category._count?.posts || 0)
                  )}
                >
                  <Hash className="w-3 h-3" />
                  <span className="font-medium">{category.name}</span>
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs bg-white/20 text-white border-0"
                  >
                    {category._count?.posts || 0}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{categories.length}</div>
                  <div className="text-sm text-muted-foreground">个分类</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {categories.reduce((sum, cat) => sum + (cat._count?.posts || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">篇文章</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {sortedCategories[0]?._count?.posts || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">最热门</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(categories.reduce((sum, cat) => sum + (cat._count?.posts || 0), 0) / categories.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">平均篇数</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
