'use client'

import { useState, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { FeaturedPosts } from '@/components/featured-posts'
import { BentoGrid } from '@/components/bento-grid'
import { CategoryTags } from '@/components/category-tags'
import { RecentPosts } from '@/components/recent-posts'
import { NewsletterCTA } from '@/components/newsletter-cta'

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  return res.json()
}

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPosts(),
          getCategories()
        ])
        setPosts(postsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const featuredPosts = posts.slice(0, 3)
  const recentPosts = posts.slice(3, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Featured Posts */}
        <FeaturedPosts posts={featuredPosts} />

        {/* 3. Bento Grid Status */}
        <BentoGrid 
          postsCount={posts.length} 
          categoriesCount={categories.length} 
        />

        {/* 4. Category Tags */}
        <CategoryTags categories={categories} />

        {/* 5. Recent Posts */}
        <RecentPosts posts={recentPosts} />

        {/* 6. Newsletter CTA */}
        <NewsletterCTA />
      </main>
    </div>
  )
}
