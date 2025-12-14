// 数据库客户端初始化
import type { Mode } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";
import * as schema from "./schema";

// 创建数据库连接池
const connection = mysql2.createPool(process.env.DATABASE_URL || "");

// 创建Drizzle实例
export const db = drizzle(connection, { schema, mode: "default" as Mode });
