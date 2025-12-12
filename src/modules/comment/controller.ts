import Elysia from "elysia";

export const commentController = new Elysia({prefix: "/api/comment"})
    .get("/", () => "Hello Elysia api/comment")