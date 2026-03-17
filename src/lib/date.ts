/**
 * Safe date formatting utilities to prevent hydration errors
 */

export function formatDate(date: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Always use zh-CN locale to ensure consistency between server and client
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateMinimal(date: string | Date | null | undefined): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}
