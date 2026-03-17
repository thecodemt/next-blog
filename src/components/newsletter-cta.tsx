'use client'

import { useState } from 'react'
import { Mail, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Mock subscription - in real app, call your API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">
                订阅成功！
              </h3>
              <p className="text-muted-foreground">
                感谢订阅我的周刊，你将第一时间收到最新文章和独家内容。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              订阅我的
              <span className="bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                技术周刊
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              每周日发送，包含精选文章、技术趋势、工具推荐和个人思考。
              <br />
              <span className="text-primary font-medium">已有 1,234 位开发者订阅</span>
            </p>
          </CardHeader>
          
          <CardContent className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="email"
                  placeholder="输入你的邮箱地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 text-base bg-white/5 border-white/20 focus-visible:ring-2 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-base group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    订阅中...
                  </>
                ) : (
                  <>
                    立即订阅
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Benefits */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">精选优质内容</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">无广告，纯技术</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">随时取消订阅</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
