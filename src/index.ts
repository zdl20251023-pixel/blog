// 应用入口文件
import { Elysia } from "elysia";
import { userController } from "./modules/user/controller"; // 用户控制器
import { articleController } from "./modules/article/controller"; // 文章控制器
import { commentController } from "./modules/comment/controller"; // 评论控制器
import { demoController } from "./modules/demo/controller"; // 演示控制器
const app = new Elysia()
  .use(demoController)
  .use(userController)  
  .use(articleController)
  .use(commentController) 
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
