import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts", // 指定数据库模式文件
  out: "./drizzle/migrations",  // 指定迁移文件输出目录 
  dialect: "mysql", // 指定数据库方言
  dbCredentials: {
    url: process.env.DATABASE_URL || "", // 指定数据库连接URL
  },
  verbose: true, // 是否输出详细日志
  strict: true, // 是否严格模式
  // schemaFilter: ["demo"], // 指定数据库模式过滤器
});