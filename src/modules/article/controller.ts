import Elysia from "elysia";

export const articleController = new Elysia({prefix: "/api/article"})
    .get("/", () => "Hello Elysia api/article")