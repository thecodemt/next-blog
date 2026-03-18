'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github, Code, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { AnimatedBackground } from '@/components/animated-background'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('邮箱或密码错误')
      } else {
        setIsSuccess(true)
        // 延迟跳转以显示动画
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)
      }
    } catch (error) {
      setError('登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('github', { callbackUrl: '/' })
    } catch (error) {
      setError('GitHub 登录失败')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex">
      <AnimatedBackground />
      
      {/* 左侧登录表单区域 */}
      <motion.div 
        className="w-full lg:w-2/5 flex items-center justify-center p-8 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="signin-form"
              className="w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* 毛玻璃卡片 */}
              <div className="backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Logo 和标题 */}
                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Code className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
                  <p className="text-white/70 text-sm">登录到你的博客空间</p>
                </div>

                {/* GitHub 登录按钮 */}
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleGitHubSignIn}
                    disabled={isLoading}
                    className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Github className="w-5 h-5 mr-2" />
                        使用 GitHub 登录
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* 分割线 */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/50">或使用邮箱登录</span>
                  </div>
                </div>

                {/* 邮箱密码登录表单 */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80 text-sm font-medium">邮箱地址</Label>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        autoComplete="email"
                        className="h-12 bg-white/5 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80 text-sm font-medium">密码</Label>
                    <div className="relative">
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          autoComplete="current-password"
                          className="h-12 bg-white/5 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 pr-12"
                        />
                      </motion.div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* 错误提示 */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 登录按钮 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner />
                          登录中...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          登录
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* 注册链接 */}
                <div className="text-center mt-6 text-white/60 text-sm">
                  还没有账号？{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-white hover:text-blue-400 underline underline-offset-4 transition-colors duration-200"
                  >
                    立即注册
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <motion.div
                  className="w-20 h-20 bg-linear-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 360, 360]
                  }}
                  transition={{ 
                    scale: { duration: 1, repeat: Infinity },
                    rotate: { duration: 1.5, ease: "easeInOut" }
                  }}
                >
                  <ArrowRight className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">登录成功！</h2>
                <p className="text-white/70">正在跳转到首页...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 右侧展示区域 */}
      <motion.div 
        className="hidden lg:flex lg:flex-1 items-center justify-center p-8 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-2xl text-center">
          <motion.h1
            className="text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            记录思考
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
              分享灵感
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/70 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            在这里，每一个想法都值得被记录，
            <br />
            每一段代码都有它的故事。
          </motion.p>

          {/* 动态代码效果 */}
          <motion.div
            className="backdrop-blur-md bg-black/30 rounded-2xl p-6 border border-white/10 font-mono text-left max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="space-y-2 text-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-blue-400"
              >
                const blog = new BlogSpace();
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-green-400"
              >
                blog.share(thoughts);
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-purple-400"
              >
                blog.inspire(others);
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
