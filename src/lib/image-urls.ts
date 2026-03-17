// Supabase Storage 图片 URL 列表
// 请手动添加你的 Supabase Storage 图片 URL
export const SUPABASE_IMAGE_URLS = [
  'https://pzrnaocjecyrbpabdbiy.supabase.co/storage/v1/object/public/next-blog/wlop-10se.jpg',
  'https://pzrnaocjecyrbpabdbiy.supabase.co/storage/v1/object/public/next-blog/wlop-11se.jpg',
  'https://pzrnaocjecyrbpabdbiy.supabase.co/storage/v1/object/public/next-blog/wlop-9se.jpg',
  // ... 添加更多图片URL
]

// 为文章随机分配图片
export function getRandomImageForPost(postId: string, index: number): string {
  if (SUPABASE_IMAGE_URLS.length === 0) {
    return '' // 如果没有图片URL，返回空字符串
  }
  
  // 使用postId和index确保每次刷新同一篇文章显示相同图片
  const seed = postId.charCodeAt(0) + index
  return SUPABASE_IMAGE_URLS[Math.abs(seed) % SUPABASE_IMAGE_URLS.length]
}
