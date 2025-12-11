// 应用入口文件
import { Elysia } from "elysia";
import { articleRoutes, commentRoutes, userRoutes } from "./routes";

const app = new Elysia()
  .use(userRoutes)
  .use(articleRoutes)
  .use(commentRoutes)
  .get("/", () => "Hello Elysia")
  .get("/user/:id", ({ params: { id } }) => id)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
