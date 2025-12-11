import Elysia from "elysia";

// 文章路由
export const articleRoutes = new Elysia({prefix: "/api/article"})
    .get("/", () => "Hello Elysia api/article")