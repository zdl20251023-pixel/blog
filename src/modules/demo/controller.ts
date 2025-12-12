import Elysia, { t } from "elysia";
import { demo_get_rsp } from "./modle";
import { DemoService } from "./service";

export const demoController = new Elysia({ prefix: "/api/demo" })
    .get("/", async () => {
        return await DemoService.getDemo();
    }, {
        response: demo_get_rsp
    })
    .get("/:id", ({ params: { id } }) => id + 3, {
        params: t.Object({
            id: t.Number()
        })
    })
    .post("/", ({ body }) => body)
    .delete("/:id", ({ params: { id } }) => {
        return { id };
    })