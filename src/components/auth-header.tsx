'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut } from 'lucide-react'

export function AuthHeader() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center space-x-3">加载中...</div>
  }

  if (!session) {
    return (
      <nav className="flex items-center space-x-3">
        <Link href="/auth/signin">
          <Button variant="outline" size="sm">登录</Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">注册</Button>
        </Link>
      </nav>
    )
  }

  return (
    <nav className="flex items-center space-x-3">
      {session.user.role === 'ADMIN' && (
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            管理
          </Button>
        </Link>
      )}
      <div className="flex items-center space-x-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || ''}
            className="w-7 h-7 rounded-full"
          />
        )}
        <span className="text-sm font-medium hidden lg:block">{session.user.name}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span className="hidden sm:block">退出</span>
        <span className="sm:hidden">退出</span>
      </Button>
    </nav>
  )
}
