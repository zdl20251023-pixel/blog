import Elysia from "elysia";

export const commentController = new Elysia({ prefix: "/api/comment" })
    .post("/create", () => "Hello Elysia api/comment/create", {
        detail: {
            tags: ["comment"],
            summary: "创建评论",
            description: "创建评论",
        },
    })
    .get("/list", () => "Hello Elysia api/comment/list", {
        detail: {
            tags: ["comment"],
            summary: "获取评论列表",
            description: "获取评论列表",
        },
    })