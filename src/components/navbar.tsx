'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, Home, FileText, User, Github } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClientOnly } from '@/components/client-only'
import { AuthHeader } from '@/components/auth-header'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '文章', href: '/posts', icon: FileText },
    { name: '关于', href: '/about', icon: User },
    { name: 'GitHub', href: 'https://github.com', icon: Github, external: true },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">
                Modern Blog
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors duration-200',
                    'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                    'hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg'
                  )}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </div>

          {/* Auth Section & Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Auth Section - Desktop Only */}
            <div className="hidden md:block">
              <AuthHeader />
            </div>
            {/* Theme Toggle */}
            <ClientOnly fallback={<div className="h-9 w-9" />}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </ClientOnly>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200',
                      'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                      'dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                    )}
                    onClick={() => setIsOpen(false)}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                )
              })}
              {/* Mobile Auth Section */}
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-2 pt-2">
                <div className="px-3 py-2">
                  <AuthHeader />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
