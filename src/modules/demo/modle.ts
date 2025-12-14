import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { demoTblSchema } from "../../lib/db/schema";


// 从 drizzle schema 派生 TypeBox 类型

// demo表所有字段
export const demoSchema = createSelectSchema(demoTblSchema);

// demoSelectSchema就是一个TypeBox类型，可以用来验证数据
// 注：demo_get_rsp 是 demoSelectSchema 的子集，不包含 createdAt 和 updatedAt 字段
export const demo_get_rsp = t.Array(t.Omit(demoSchema, ["createdAt", "updatedAt"]));

export type demo_get_rsp_type = typeof demo_get_rsp.static;

export const demo_post_body = t.Omit(demoSchema, ["id", "createdAt", "updatedAt"]);
export type demo_post_body_type = typeof demo_post_body.static;

export const demo_post_rsp = demoSchema;
export type demo_post_rsp_type = typeof demo_post_rsp.static;