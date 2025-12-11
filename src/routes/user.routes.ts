import Elysia from "elysia";

// 用户路由
export const userRoutes = new Elysia({prefix: "/api/user"})
  .get("/", () => "Hello Elysia api/user")