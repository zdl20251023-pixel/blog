import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { demoTblSchema } from "../../lib/db/schema";
import { redisManagerInstance } from "../../lib/redis";
import { ErrorCode } from "../../utils/errorCode";
import type { demo_get_rsp_type, demo_post_body_type, demo_post_rsp_type } from "./modle";

export abstract class DemoService {
    /**
     * 获取演示数据列表
     * 包含 Redis 缓存测试和数据库查询
     * @returns 返回 [错误码, 演示数据列表或null]
     */
    static async get(): Promise<[number, demo_get_rsp_type | null]> {
        try {
            // 1. Redis 缓存测试：生成随机值并测试缓存读写
            const randValue = Math.floor(Math.random() * 100) + 1;

            // 获取旧的缓存值（如果存在）
            let oldCachedValue: string | null = null;
            try {
                oldCachedValue = await redisManagerInstance.get("demo");
                console.log("Redis 旧缓存值:", oldCachedValue);
            } catch (redisError) {
                // Redis 操作失败不影响主流程，只记录警告
                console.warn("获取 Redis 缓存失败（不影响主流程）:", redisError);
            }

            // 设置新的缓存值
            try {
                await redisManagerInstance.set("demo", randValue.toString());
                const newCachedValue = await redisManagerInstance.get("demo");
                console.log("Redis 新缓存值:", newCachedValue);
            } catch (redisError) {
                // Redis 操作失败不影响主流程，只记录警告
                console.warn("设置 Redis 缓存失败（不影响主流程）:", redisError);
            }

            // 2. 从数据库查询演示数据（限制返回 10 条）
            const data = await db
                .select()
                .from(demoTblSchema)
                .limit(10);

            console.log("查询到的演示数据数量:", data.length);

            // 3. 返回查询结果
            // 注意：即使查询结果为空数组，也返回成功（空数组表示没有数据，不是错误）
            return [ErrorCode.SUCCESS, data.length > 0 ? data : null];
        } catch (error) {
            // 捕获并记录数据库查询错误
            console.error("获取演示数据时发生错误：", error);
            return [ErrorCode.ERROR, null];
        }
    }

    /**
     * 创建演示数据
     * @param body - 要创建的演示数据（不包含 id、createdAt、updatedAt）
     * @returns 返回 [错误码, 创建的数据或null]
     */
    static async post(body: demo_post_body_type): Promise<[number, demo_post_rsp_type | null]> {
        try {
            // 使用 $returningId() 获取插入后的 ID（MySQL 专用方法）
            const insertResult = await db.insert(demoTblSchema).values(body).$returningId();

            // 检查插入结果
            if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
                console.error("插入失败：未获取到插入ID", insertResult);
                return [ErrorCode.ERROR, null];
            }

            const insertId = insertResult[0].id;

            // 查询刚插入的完整记录（包含 createdAt 和 updatedAt）
            const insertedData = await db
                .select()
                .from(demoTblSchema)
                .where(eq(demoTblSchema.id, insertId))
                .limit(1);

            if (!insertedData || insertedData.length === 0) {
                console.error("插入成功但查询失败：未找到插入的记录", { insertId });
                return [ErrorCode.ERROR, null];
            }

            return [ErrorCode.SUCCESS, insertedData[0] || null];
        } catch (error) {
            // 捕获并记录数据库错误
            console.error("创建演示数据时发生错误：", error);
            return [ErrorCode.ERROR, null];
        }
    }
}