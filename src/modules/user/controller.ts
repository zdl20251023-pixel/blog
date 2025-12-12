import Elysia from "elysia";

export const userController = new Elysia({prefix: "/api/user"})
    .get("/", () => "Hello Elysia api/user")