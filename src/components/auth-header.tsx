'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut } from 'lucide-react'

export function AuthHeader() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center space-x-4">Loading...</div>
  }

  if (!session) {
    return (
      <nav className="flex items-center space-x-4">
        <Link href="/auth/signin">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/auth/signup">
          <Button>Sign Up</Button>
        </Link>
      </nav>
    )
  }

  return (
    <nav className="flex items-center space-x-4">
      {session.user.role === 'ADMIN' && (
        <Link href="/admin">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      )}
      <div className="flex items-center space-x-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || ''}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{session.user.name}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </nav>
  )
}
