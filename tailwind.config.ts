import type { Config } from 'tailwindcss'

/** 
 * Tailwind CSS v4 配置文件
 * 大多数主题配置已移至 src/app/globals.css 中的 @theme 块。
 * 此文件保留用于内容扫描路径和插件配置。
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 主题扩展已移至 CSS 文件，这里保持最简
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
