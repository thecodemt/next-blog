# Next Blog

一个功能完整的现代化博客平台，采用 Next.js 16、React 19、TypeScript 和 Prisma ORM 构建。支持 Markdown 文章、分类、标签、用户认证和管理后台。

## ✨ 主要特性

- 📝 **Markdown 文章编辑** - 支持 GFM、数学公式（KaTeX）、代码高亮
- 🏷️ **分类与标签** - 灵活的文章分类和标签系统
- 👤 **用户认证** - 集成 NextAuth 支持本地注册和 OAuth（GitHub、Google）
- 🔐 **权限管理** - 基于角色的访问控制（管理员、普通用户）
- ⚙️ **管理后台** - 完整的文章、用户、分类、标签管理界面
- 🌓 **深色模式** - 内置深色/浅色主题切换
- 📊 **阅读分析** - 阅读进度条、相关文章推荐
- 🎨 **响应式设计** - 使用 Tailwind CSS 构建的现代化 UI
- 📱 **移动友好** - 完全适配各种设备屏幕

## 🛠️ 技术栈

### 核心框架
- **Next.js 16** - React 框架
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架

### 后端与数据库
- **Prisma ORM** - 数据库访问层
- **PostgreSQL** - 关系数据库
- **NextAuth.js** - 认证解决方案

### 特殊功能
- **react-markdown** - Markdown 解析
- **rehype-highlight** - 代码高亮
- **rehype-katex** - 数学公式渲染
- **remark-gfm** - GitHub Flavored Markdown
- **@auth/prisma-adapter** - NextAuth 与 Prisma 集成

### 工具库
- **react-hook-form** - 表单管理
- **zod** - Schema 验证
- **date-fns** - 日期处理
- **Radix UI** - 无样式 UI 组件库
- **bcryptjs** - 密码加密

## 🚀 快速开始

### 前置要求
- Node.js 18+
- PostgreSQL 14+
- npm、yarn 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd next-blog
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件：
```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth 提供商（可选）
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 基础 URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. **初始化数据库**
```bash
npm run prisma:migrate
npm run prisma:seed
```

5. **启动开发服务器**
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 开始使用。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   ├── admin/             # 管理后台
│   ├── api/               # API 路由
│   ├── post/              # 文章详情页
│   ├── posts/             # 文章列表页
│   ├── category/          # 分类页面
│   ├── tag/               # 标签页面
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/                # 通用 UI 组件
│   └── ...                # 功能组件
├── lib/                   # 工具函数
│   ├── auth.ts            # 认证配置
│   ├── prisma.ts          # Prisma 客户端
│   └── utils.ts           # 通用工具
└── styles/                # 全局样式

prisma/
├── schema.prisma          # 数据库 Schema
├── seed.ts                # 数据库种子
└── migrations/            # 迁移文件
```

## 📚 数据库模型

### User（用户）
- 支持本地登录和 OAuth 认证
- 角色权限管理（USER、ADMIN）
- 用户个人资料（昵称、头像、简介等）

### Post（文章）
- Markdown 内容存储
- 发布状态管理
- 浏览次数统计
- 分类和标签支持

### Category（分类）
- 文章分类管理
- URL 友好的 Slug

### Tag（标签）
- 灵活的多标签系统
- 热门标签统计

### Comment（评论）
- 用户互动

### Like（点赞）
- 文章点赞支持

### Bookmark（书签）
- 用户收藏支持

## 🔑 API 路由

### 文章管理
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[id]` - 获取文章详情
- `POST /api/admin/posts` - 创建文章
- `PUT /api/admin/posts/[id]` - 更新文章
- `DELETE /api/admin/posts/[id]` - 删除文章

### 分类管理
- `GET /api/categories` - 获取分类列表
- `POST /api/admin/categories` - 创建分类

### 标签管理
- `GET /api/tags` - 获取标签列表
- `POST /api/admin/tags` - 创建标签

### 用户管理
- `GET /api/admin/users` - 获取用户列表
- `PUT /api/admin/users/[id]` - 更新用户

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/signin` - 登录

## 📝 常用命令

```bash
# 开发
npm run dev

# 构建生产版本
npm run build

# 运行生产服务器
npm start

# 执行 ESLint 检查
npm run lint

# Prisma 数据库命令
npx prisma migrate dev       # 创建数据库迁移
npx prisma generate          # 生成 Prisma 客户端
npx prisma seed              # 运行数据库种子
npx prisma studio            # 打开 Prisma Studio（数据库管理）
```

## 🔐 认证配置

### NextAuth 集成
项目已预配置 NextAuth 支持：
- 本地用户认证（用户名/密码）
- GitHub OAuth
- Google OAuth

### 密码安全
使用 bcryptjs 对用户密码进行加密存储。

## 🎨 自定义样式

项目使用 Tailwind CSS，所有样式配置位于 `tailwind.config.ts`。

UI 组件位于 `src/components/ui/`，基于 Radix UI 构建。

## 📦 部署

### 部署到 Vercel
```bash
npm install -g vercel
vercel
```

### 部署到其他平台
1. 确保设置了所有必需的环境变量
2. 运行 `npm run build` 构建项目
3. 启动 `npm start` 运行生产服务器

## 🔄 数据库迁移

首次运行项目时：
```bash
npx prisma migrate deploy
```

添加新字段时：
```bash
npx prisma migrate dev --name <migration-name>
```

## 💡 开发建议

1. **代码规范** - 使用 ESLint 保持代码质量
2. **类型安全** - 充分利用 TypeScript 类型检查
3. **性能优化** - 使用 Next.js 的内置优化功能
4. **环境变量** - 敏感信息统一在 `.env.local` 中管理

## 📖 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth 文档](https://next-auth.js.org)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [TypeScript 文档](https://www.typescriptlang.org)

## 📄 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。
