## 💡 **具体的学习任务清单**

### **任务1：环境搭建（完全自己）**
```bash
# 1. 安装Bun（按照官网步骤）
curl -fsSL https://bun.sh/install | bash

# 2. 安装MySQL（官方文档）
brew install mysql  # 或 apt-get install mysql

# 3. 安装Redis
brew install redis  # 或 apt-get install redis

# 4. 验证安装
bun --version
mysql --version
redis-cli ping
```

### **任务2：第一个API（先尝试后参考）**
```typescript
// 1. 先自己尝试创建Elysia应用
// 2. 写一个简单的GET /hello接口
// 3. 如果卡住，问："Elysia的基本路由怎么写？"
// 4. 理解后自己写完整
```

### **任务3：数据库连接（看文档为主）**
```typescript
// 1. 查看MySQL2或Prisma文档
// 2. 自己写连接配置
// 3. 测试连接是否成功
// 4. 问AI："MySQL连接池的最佳配置是什么？"
```

### **任务4：完整功能（自己主导）**
```typescript
// 用户注册功能开发流程：
1. 自己设计数据库表
2. 自己写DTO验证
3. 自己实现密码哈希
4. 自己写错误处理
5. 自己测试

// 遇到具体问题：
"Node.js中如何安全地比较密码哈希？"
```