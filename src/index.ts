// 应用入口文件
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { db } from "./lib/db";
import { articleController } from "./modules/article/controller"; // 文章控制器
import { commentController } from "./modules/comment/controller"; // 评论控制器
import { demoController } from "./modules/demo/controller"; // 演示控制器
import { userController } from "./modules/user/controller"; // 用户控制器
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
  .get("/", () => "Hello Elysia")
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
