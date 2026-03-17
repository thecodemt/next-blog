'use client'

import { useState, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { FeaturedPosts } from '@/components/featured-posts'
import { RecentPosts } from '@/components/recent-posts'

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
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-32">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute inset-0 opacity-20"></div>
              <div className="w-24 h-24 bg-primary/40 rounded-full animate-pulse relative flex items-center justify-center">
                <div className="w-12 h-12 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-96 mx-auto animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="relative">
        {/* 1. Hero Section */}
        <div className="relative pt-10 pb-16 overflow-hidden">
          <HeroSection />
        </div>

        {/* 2. Featured Posts */}
        <section className="relative z-10 bg-slate-50/30 dark:bg-slate-900/30 backdrop-blur-sm py-20 border-y border-slate-200/50 dark:border-slate-800/50">
          <FeaturedPosts posts={featuredPosts} />
        </section>

        {/* 3. Recent Posts & Categories */}
        <div className="container mx-auto px-4 py-20">
          <RecentPosts posts={recentPosts} categories={categories} />
        </div>
      </main>
    </div>
  )
}

