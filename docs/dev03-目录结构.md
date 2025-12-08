```text
blog-api/                          # 项目根目录
├── src/                           # 源代码目录
│   ├── index.ts                   # 应用入口文件
│   ├── config/                    # 配置文件
│   │   ├── index.ts               # 配置聚合导出
│   │   ├── database.ts            # 数据库连接配置
│   │   ├── redis.ts               # Redis连接配置
│   │   └── env.ts                 # 环境变量配置
│   ├── lib/                       # 核心库/工具
│   │   ├── db/                    # 数据库客户端
│   │   │   ├── index.ts           # 数据库客户端初始化
│   │   │   └── seed.ts            # 数据库种子数据
│   │   └── redis/                 # Redis客户端
│   │       └── index.ts           # Redis客户端初始化
│   ├── models/                    # 数据模型（TypeScript类型 + Drizzle Schema）
│   │   ├── index.ts               # 模型聚合导出
│   │   ├── user.model.ts          # 用户模型
│   │   ├── article.model.ts       # 文章模型
│   │   └── comment.model.ts       # 评论模型
│   ├── services/                  # 业务逻辑层
│   │   ├── user.service.ts        # 用户相关业务
│   │   ├── article.service.ts     # 文章相关业务
│   │   └── comment.service.ts     # 评论相关业务
│   ├── controllers/               # 控制器层（或handlers）
│   │   ├── user.controller.ts     # 用户控制器
│   │   ├── article.controller.ts  # 文章控制器
│   │   └── comment.controller.ts  # 评论控制器
│   ├── routes/                    # 路由定义
│   │   ├── index.ts               # 路由聚合
│   │   ├── auth.routes.ts         # 认证路由
│   │   ├── user.routes.ts         # 用户路由
│   │   ├── article.routes.ts      # 文章路由
│   │   └── comment.routes.ts      # 评论路由
│   ├── middleware/                # 自定义中间件
│   │   ├── auth.middleware.ts     # 认证中间件
│   │   ├── validation.middleware.ts # 请求验证中间件
│   │   └── error.middleware.ts    # 错误处理中间件
│   ├── utils/                     # 工具函数
│   │   ├── jwt.ts                 # JWT工具
│   │   ├── password.ts            # 密码加密/验证
│   │   ├── logger.ts              # 日志工具
│   │   └── validator.ts           # 验证工具
│   └── types/                     # TypeScript类型定义
│       ├── request.ts             # 请求类型
│       ├── response.ts            # 响应类型
│       └── index.ts               # 类型聚合导出
├── tests/                         # 测试目录
│   ├── unit/                      # 单元测试
│   └── integration/               # 集成测试
├── docker/                        # Docker相关配置
│   ├── Dockerfile                 # Docker构建文件
│   └── docker-compose.yml         # 服务编排（MySQL + Redis）
├── scripts/                       # 脚本目录
│   ├── seed-db.ts                 # 数据库种子脚本
│   └── migration.ts               # 数据库迁移脚本
├── prisma/                        # Prisma ORM配置（如果使用）
│   └── schema.prisma              # Prisma数据模型定义
├── drizzle/                       # Drizzle ORM配置（如果使用）
│   ├── schema.ts                  # Drizzle数据模型
│   └── migrations/                # 迁移文件
├── public/                        # 静态资源（如果需要）
├── .env.example                   # 环境变量示例
├── .env                           # 环境变量（本地开发，.gitignore）
├── .env.test                      # 测试环境变量
├── .gitignore                     # Git忽略文件
├── bun.lockb                      # Bun锁文件
├── package.json                   # 项目依赖和脚本
├── tsconfig.json                  # TypeScript配置
├── README.md                      # 项目说明
└── LICENSE                        # 开源协议
```
