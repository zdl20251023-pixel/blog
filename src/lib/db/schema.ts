import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

// demo表的Schema
export const demoTblSchema = mysqlTable("demo", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});