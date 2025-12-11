// 评论路由
import Elysia from "elysia";

export const commentRoutes = new Elysia({prefix: "/api/comment"})
    .get("/", () => "Hello Elysia api/comment")