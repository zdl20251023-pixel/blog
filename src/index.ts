// 应用入口文件
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { configTables } from "./lib/config-tables"; // 配置表实例
import { db } from "./lib/db";
import { articleController } from "./modules/article/controller"; // 文章控制器
import { commentController } from "./modules/comment/controller"; // 评论控制器
import { demoController } from "./modules/demo/controller"; // 演示控制器
import { userController } from "./modules/user/controller"; // 用户控制器
import { Circle, Rect } from "./output_code/schema";

const app = new Elysia()
  .use(swagger({
    version: "1.0.0",
    theme: "dark",
    exclude: ["/"],
    // 具体原因后面再查
    // exclude: ["/", "/api/article/detail"],  // 注：指定完整路径可以正常排除
    // exclude: ["/", "/^\/api\/article/"],  // 注：使用正则表达式排除，但是无法正常排除
    // excludeTags: ["article"],  // 注：使用指定标签排除暂时不能用
  }))
  .decorate("db", db)
  .decorate("tables", configTables) // 注入配置表实例，可在路由中通过 context.tables 访问
  .get("/", () => "Hello Elysia")
  // 配置表测试路由 - 用于验证配置表是否正常加载
  .get("/test/config-tables", ({ tables }) => {
    const item = tables.Tbitem.get(1001);
    // 使用类型守卫检查是否为 Circle 类型
    if (item && item.s1 instanceof Circle) {
      console.log(JSON.stringify(item, null, 2), item.s1.radius);
    } else if (item && item.s1 instanceof Rect) {
      console.log(JSON.stringify(item, null, 2), `Rect: ${item.s1.width}x${item.s1.height}`);
    }
    const reward = tables.Tbreward.get(1001);
    reward?.m1.forEach((value, key) => {
      console.log(key, value);
    });
    const value = reward?.m1.get(2);
    console.log(value);
    // 访问常量
    console.log("x8", tables.Tbconstant.getDataList()[0]?.x8);
    return {
      success: true,
      message: "配置表加载成功",
      stats: {
        itemCount: tables.Tbitem.getDataList().length,
        rewardCount: tables.Tbreward.getDataList().length,
      },
      sampleData: {
        item: tables.Tbitem.get(1001) || null,
        itemId: tables.Tbitem.get(1001)?.id || null,
        reward: tables.Tbreward.get(1001) || null,
      },
    };
  }, {
    detail: {
      tags: ["测试"],
      summary: "验证配置表加载",
      description: "验证 Luban 导表数据是否正常加载",
    },
  })
  .get("/:id", (Context) => {
    console.log(JSON.stringify(Context, null, 2));
    return {
      id: Context.params.id,
      query: Context.query,
    };
  })
  .use(demoController)
  .use(userController)
  .use(articleController)
  .use(commentController)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
