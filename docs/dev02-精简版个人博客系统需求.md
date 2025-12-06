# 🎯 **精简版个人博客系统需求**

## 📋 **核心目标**
- **学习后端基础**：掌握 Bun + Elysia + MySQL + Redis 的基本使用
- **完成最小可用产品**：实现博客核心功能
- **循序渐进**：从简单到复杂，不追求完美

## 🎪 **第一阶段：基础版本（1-2周）**

### **🎯 必须实现的核心功能**

#### **1. 用户模块（基础）**
```typescript
// 最简单的用户系统
✅ 用户注册（邮箱+密码）
✅ 用户登录（JWT token）
✅ 获取当前用户信息

// 不需要的功能
❌ 邮箱验证
❌ 密码找回
❌ 第三方登录
❌ 用户个人资料修改
```

#### **2. 文章模块（基础）**
```typescript
// 最简单的文章管理
✅ 创建文章（标题、内容）
✅ 获取文章列表（分页）
✅ 获取单篇文章
✅ 更新文章（作者本人）
✅ 删除文章（作者本人）

// 简化处理
❌ 文章分类/标签
❌ 文章状态（草稿/发布）
❌ 文章置顶
❌ 文章封面图
```

#### **3. 评论模块（简化）**
```typescript
// 最简评论功能
✅ 对文章发表评论
✅ 获取文章的评论列表

// 简化处理
❌ 回复评论（嵌套结构）
❌ 评论审核
❌ 评论点赞
```

## 📊 **数据结构（简化版）**

### **数据库表设计（3张表足够）**

```sql
-- 1. 用户表（最简）
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 文章表（最简）
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 评论表（最简）
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 **技术栈学习重点**

### **Bun 重点学习**
```typescript
// 掌握这些就够
✅ bun run 运行项目
✅ bun install 安装依赖
✅ bun --hot 热重载
✅ bun test 运行测试（可选）
```

### **Elysia 重点学习**
```typescript
// 核心概念
✅ 基础路由配置
✅ 中间件使用（认证、日志）
✅ 请求验证（body、params）
✅ 错误处理
✅ 响应格式化

// 暂时跳过
❌ WebSocket
❌ 插件系统（高级）
❌ 文件上传流处理
```

### **MySQL 重点学习**
```typescript
// 核心操作
✅ 连接数据库
✅ 基本CRUD操作
✅ 简单查询（WHERE、ORDER BY、LIMIT）
✅ 联表查询（JOIN）

// 暂时跳过
❌ 事务处理
❌ 存储过程
❌ 复杂索引优化
```

### **Redis 重点学习**
```typescript
// 核心使用
✅ 字符串存储（文章缓存）
✅ 哈希存储（用户session）
✅ 有序集合（文章阅读排行）

// 暂时跳过
❌ 发布订阅
❌ 分布式锁
❌ Lua脚本
```

## 🚀 **API接口设计（精简版）**

### **用户相关**
```bash
# 认证
POST   /api/auth/register      # 注册
POST   /api/auth/login         # 登录
GET    /api/auth/me            # 获取当前用户

# 用户信息
GET    /api/users/:id          # 获取用户信息（公开）
```

### **文章相关**
```bash
# 文章CRUD
GET    /api/articles           # 文章列表（分页）
POST   /api/articles           # 创建文章（需要登录）
GET    /api/articles/:id       # 文章详情
PUT    /api/articles/:id       # 更新文章（作者本人）
DELETE /api/articles/:id       # 删除文章（作者本人）
```

### **评论相关**
```bash
# 评论
POST   /api/articles/:id/comments    # 发表评论（需要登录）
GET    /api/articles/:id/comments    # 获取文章评论列表
```

## 🧠 **学习目标分解**

### **第1天：项目初始化**
```bash
# 目标
✅ 创建项目结构
✅ 配置开发环境
✅ 编写第一个API接口

# 产出
GET /api/hello -> { message: "Hello Blog" }
```

### **第2-3天：数据库连接**
```bash
# 目标
✅ 连接MySQL数据库
✅ 创建3张基础表
✅ 实现第一个模型（User）

# 产出
User.create() 和 User.find() 方法
```

### **第4-5天：用户认证**
```bash
# 目标
✅ 实现用户注册
✅ 实现用户登录（JWT）
✅ 密码加密存储

# 产出
POST /api/auth/register
POST /api/auth/login
```

### **第6-7天：文章模块**
```bash
# 目标
✅ 创建文章接口
✅ 获取文章列表（分页）
✅ 文章详情接口

# 产出
完整的文章CRUD API
```

### **第8天：评论模块**
```bash
# 目标
✅ 发表评论
✅ 获取评论列表

# 产出
评论相关API
```

### **第9天：Redis集成**
```bash
# 目标
✅ 文章详情缓存
✅ 用户session存储
✅ 热门文章排行

# 产出
集成Redis的基础用法
```

### **第10天：项目完善**
```bash
# 目标
✅ 错误处理完善
✅ API文档生成
✅ 基础测试

# 产出
可部署的完整项目
```

## ⚙️ **配置文件（简化）**

```typescript
// .env 文件（只需要这些）
DATABASE_URL="mysql://user:password@localhost:3306/blog"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-key"
PORT=3000

// 不需要的复杂配置
❌ 邮件服务配置
❌ 文件上传配置
❌ 多环境配置
```

## 🎨 **项目结构（最简）**

```bash
src/
├── index.ts              # 应用入口
├── config/               # 配置文件
│   └── index.ts
├── database/             # 数据库
│   ├── client.ts        # MySQL连接
│   └── redis.ts         # Redis连接
├── models/              # 数据模型
│   ├── user.ts
│   ├── article.ts
│   └── comment.ts
├── routes/              # 路由
│   ├── auth.ts         # 认证路由
│   ├── articles.ts     # 文章路由
│   └── comments.ts     # 评论路由
├── middleware/          # 中间件
│   ├── auth.ts         # 认证中间件
│   └── error.ts        # 错误处理
└── utils/              # 工具函数
    ├── jwt.ts          # JWT工具
    └── password.ts     # 密码加密
```

## 💡 **学习建议**

### **重点掌握（80%精力）**
```typescript
// 这些是核心，必须掌握
1. Bun的基本使用和生态
2. Elysia的路由和中间件
3. MySQL的基础CRUD操作
4. Redis的基本数据类型和使用场景
5. JWT认证流程
```

### **次要了解（20%精力）**
```typescript
// 这些了解即可，后期再深入
1. 数据库连接池优化
2. Redis高级特性
3. 复杂的查询优化
4. 安全性深度加固
```

## 🚦 **完成标准**

### **最低完成标准**
```typescript
// 项目能够运行，并且：
✅ 用户能注册、登录
✅ 登录后能创建文章
✅ 能查看文章列表和详情
✅ 能对文章发表评论
✅ 使用了Redis缓存文章详情

// 不需要的功能
❌ 后台管理系统
❌ 复杂的权限控制
❌ 文件上传
❌ 邮件通知
❌ 统计分析
```

## 🎯 **最终产出物**

```bash
# 完成后你应该有：
1. 一个能运行的博客后端API
2. GitHub仓库（代码+README）
3. 掌握的技术点笔记
4. 能向他人演示的基础项目

# 核心能力提升
✓ 理解了后端开发基本流程
✓ 掌握了技术栈基础用法
✓ 能独立开发简单API
✓ 为后续学习打下基础
```

---
