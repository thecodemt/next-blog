import { NextAuthOptions } from 'next-auth'
import { prisma } from '@/lib/prisma'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// 扩展 NextAuth 的 Session 接口，添加自定义用户字段
declare module 'next-auth' {
  interface Session {
    user: {
      id: string      // 用户唯一标识符
      email: string   // 用户邮箱
      name?: string   // 用户姓名（可选）
      image?: string  // 用户头像（可选）
      role: string    // 用户角色（USER/ADMIN）
    }
  }

  // 扩展 User 接口，添加角色字段
  interface User {
    role: string
  }
}

// 扩展 JWT 接口，添加角色字段用于令牌传递
declare module 'next-auth/jwt' {
  interface JWT {
    role: string
  }
}

// NextAuth 配置选项
export const authOptions: NextAuthOptions = {
  // 配置多个认证提供者
  providers: [
    // GitHub OAuth 提供者
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,      // GitHub 应用客户端ID
      clientSecret: process.env.GITHUB_SECRET!, // GitHub 应用客户端密钥
    }),
    // 邮箱密码认证提供者
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      // 授权回调函数，验证用户凭据
      async authorize(credentials) {
        // 检查是否提供了邮箱和密码
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 在数据库中查找用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        // 检查用户是否存在且设置了密码（排除OAuth用户）
        if (!user || !user.password) {
          return null
        }

        // 验证密码是否正确
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        // 密码错误则返回null
        if (!isPasswordValid) {
          return null
        }

        // 返回用户对象（包含角色信息）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  // 配置会话策略为JWT
  session: {
    strategy: 'jwt'
  },
  // 配置回调函数处理JWT和Session
  callbacks: {
    // JWT回调：在创建或更新JWT时调用
    async jwt({ token, user }) {
      // 如果有用户信息，将角色添加到JWT中
      if (user) {
        token.role = user.role
      }
      return token
    },
    // Session回调：在创建会话时调用
    async session({ session, token }) {
      // 从JWT中提取用户信息并添加到会话中
      if (token && session.user) {
        session.user.id = token.sub!      // 用户ID
        session.user.role = token.role    // 用户角色
      }
      return session
    }
  },
  // 自定义页面路由
  pages: {
    signIn: '/auth/signin',  // 自定义登录页面路径
  }
}
