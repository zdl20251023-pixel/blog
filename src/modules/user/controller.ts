import Elysia from "elysia";

export const userController = new Elysia({ prefix: "/api/user" })
    .post("/register", () => "Hello Elysia api/user/register", {
        detail: {
            tags: ["user"],
            summary: "用户注册",
            description: "用户注册",
        },
    })
    .post("/login", () => "Hello Elysia api/user/login", {
        detail: {
            tags: ["user"],
            summary: "用户登录",
            description: "用户登录",
        },
    })
    .get("/me", () => "Hello Elysia api/user/me", {
        detail: {
            tags: ["user"],
            summary: "获取当前用户",
            description: "获取当前用户",
        },
    })