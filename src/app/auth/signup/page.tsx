'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BreatheInput } from '@/components/breathe-input'
import { MeshGradientBg } from '@/components/mesh-gradient-bg'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为6位')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // 延迟跳转以显示成功动画
        setTimeout(() => {
          router.push('/auth/signin?message=注册成功，请登录')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || '注册失败，请稍后重试')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <MeshGradientBg />
      
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="signup-form"
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* 悬浮的表单容器 */}
            <motion.div
              className="bg-white/70 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 border border-white/20 dark:border-white/10"
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* 头部装饰 */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-16 h-16 bg-linear-to-br from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* 标题 */}
              <div className="text-center mb-8">
                <motion.h1
                  className="text-3xl font-light text-slate-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  创建账号
                </motion.h1>
                <motion.p
                  className="text-sm text-slate-600 dark:text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  开始你的博客之旅
                </motion.p>
              </div>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <BreatheInput
                    id="name"
                    name="name"
                    type="text"
                    label="姓名"
                    placeholder="请输入你的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <BreatheInput
                    id="email"
                    name="email"
                    type="email"
                    label="邮箱地址"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <BreatheInput
                    id="password"
                    name="password"
                    type="password"
                    label="密码"
                    placeholder="至少6位字符"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <BreatheInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="确认密码"
                    placeholder="再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </motion.div>

                {/* 错误提示 */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 注册按钮 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full font-medium shadow-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner />
                        创建中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        创建账号
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* 登录链接 */}
              <motion.div
                className="text-center mt-8 text-sm text-slate-600 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                已有账号？{' '}
                <Link 
                  href="/auth/signin" 
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  立即登录
                </Link>
              </motion.div>
            </motion.div>
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
            <div className="bg-white/70 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 border border-white/20 dark:border-white/10">
              <motion.div
                className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360, 360]
                }}
                transition={{ 
                  scale: { duration: 1, repeat: Infinity },
                  rotate: { duration: 1.5, ease: "easeInOut" }
                }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-2">注册成功！</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">正在跳转到登录页面...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
