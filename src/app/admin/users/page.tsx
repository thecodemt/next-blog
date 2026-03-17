'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, ArrowLeft, Search, Shield, User, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  image?: string
  bio?: string
  website?: string
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
    comments: number
  }
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (session && session.user.role !== 'ADMIN') {
      redirect('/')
    }
    if (session) {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    const confirmMessage = `Are you sure you want to delete "${user.name}"? This action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUsers()
        alert('User deleted successfully')
      } else {
        const error = await response.json()
        if (error.details) {
          alert(`Cannot delete user: ${error.error}\nPosts: ${error.details.posts}, Comments: ${error.details.comments}`)
        } else {
          alert(error.error || 'Failed to delete user')
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Users Management</h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              {users.length} total users
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role === 'ADMIN' ? (
                              <><Shield className="w-3 h-3 mr-1" />Admin</>
                            ) : (
                              'User'
                            )}
                          </Badge>
                        </div>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {user.email !== session?.user?.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          disabled={user._count.posts > 0 || user._count.comments > 0}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                          title={user._count.posts > 0 || user._count.comments > 0 ? "User has associated content" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{user._count.posts}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="font-medium">{user._count.comments}</div>
                      <div className="text-muted-foreground">Comments</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.website ? (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        ) : (
                          'No website'
                        )}
                      </div>
                      <div className="text-muted-foreground">Portfolio</div>
                    </div>
                    <div>
                      <div className="font-medium truncate">
                        {user.bio || 'No bio'}
                      </div>
                      <div className="text-muted-foreground">Bio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? 'No users found' : 'No users yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms.'
                      : 'Users will appear here when they register for an account.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
