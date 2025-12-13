import Elysia from "elysia";
import { createResponseSchema, responseFromService } from "../../utils/response";
import { demo_get_rsp } from "./modle";
import { DemoService } from "./service";

export const demoController = new Elysia({ prefix: "/api/demo" })
    .get("/", async ({ }) => {
        const [code, data] = await DemoService.getDemo();
        // 原始写法
        // return { code, data };
        // 使用通用函数
        return responseFromService(code, data);
    }, {
        // 简写形式，默认就是200状态码
        // response: t.Object({
        //     code: t.Number(),
        //     data: demo_get_rsp
        // })
        // 完整形式，可以定义多个响应状态码-推荐
        // 原始写法
        // response: {
        //     200: t.Object({
        //         code: t.Number(),
        //         data: demo_get_rsp
        //     })
        // }
        // 使用通用函数，data 可以为 null
        response: {
            200: createResponseSchema(demo_get_rsp)
        },
        // 可以定义多个响应状态码
        // response: {
        //     200: t.Object({
        //         code: t.Number(),
        //         data: demo_get_rsp
        //     }),
        //     500: t.Object({
        //         code: t.Number(),
        //         data: demo_get_rsp
        //     })
        // }
        detail: {
            tags: ["demo"],
            summary: "获取演示数据",
            description: "获取演示数据",
        },
    })
    .get("/:id", ({ params: { id } }) => id, {
        // params: t.Object({
        //     id: t.Number()
        // })
        detail: {
            tags: ["demo"],
            summary: "获取演示数据",
            description: "获取演示数据",
        },
    })
    // // 多参数
    // // 测试用例 http://localhost:8000/api/demo/3abc/22
    // // 返回结果 3abc_22
    // .get("/:id/:name", ({ params: { id, name } }) => id + '_' + name, {
    //     // params: t.Object({
    //     //     id: t.Number()
    //     // })
    // })
    // // 可选参数
    // // 测试用例 http://localhost:8000/api/demo/3abc/22?
    // // 返回结果 3abc_22
    // .get("/:id/:name?", ({ params: { id, name } }) => id + '_' + name, {
    //     // params: t.Object({
    //     //     id: t.Number()
    //     // })
    // })    
    .post("/", ({ body }) => body, {
        detail: {
            tags: ["demo"],
            summary: "创建演示数据",
            description: "创建演示数据",
        },
    })
    .delete("/:id", ({ params: { id } }) => {
        return { id };
    }, {
        detail: {
            tags: ["demo"],
            summary: "删除演示数据",
            description: "删除演示数据",
        },
    })