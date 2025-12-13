import Elysia from "elysia";

export const articleController = new Elysia({ prefix: "/api/article" })
    .get("/list", () => "Hello Elysia api/article/list", {
        detail: {
            tags: ["article"],
            summary: "获取文章列表",
            description: "获取文章列表",
        },
    })
    .post("/create", () => "Hello Elysia api/article/create", {
        detail: {
            tags: ["article"],
            summary: "创建文章",
            description: "创建文章",
        },
    })
    .get("/detail", () => "Hello Elysia api/article/detail", {
        detail: {
            tags: ["article"],
            summary: "获取文章详情",
            description: "获取文章详情",
        },
    })
    .put("/update", () => "Hello Elysia api/article/update", {
        detail: {
            tags: ["article"],
            summary: "更新文章",
            description: "更新文章",
        },
    })
    .delete("/delete", () => "Hello Elysia api/article/delete", {
        detail: {
            tags: ["article"],
            summary: "删除文章",
            description: "删除文章",
        },
    })