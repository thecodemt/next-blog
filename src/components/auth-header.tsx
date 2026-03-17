'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthHeader() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800 hidden lg:block" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-2 font-medium">
            <LogIn className="w-4 h-4" />
            <span>登录</span>
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
            <UserPlus className="w-4 h-4 mr-2 hidden sm:block" />
            <span>注册</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 p-1 pl-2 pr-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xs">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || ''}
            className="w-7 h-7 rounded-full border border-slate-200/50 dark:border-slate-800/50"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1 hidden lg:block truncate max-w-[100px]">
          {session.user.name}
        </span>
        
        <div className="flex items-center border-l border-slate-200/50 dark:border-slate-800/50 ml-1 pl-1">
          {session.user.role === 'ADMIN' && (
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400" title="管理后台">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-7 w-7 rounded-full text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
            title="退出登录"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
