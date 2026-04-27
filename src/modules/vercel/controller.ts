import Elysia from "elysia";
import { apiErrorResponseSchema, chatStreamBodySchema } from "./model";
import { buildErrorResponse, chatStream } from "./service";

export const vercelController = new Elysia({ prefix: "/api/vercel" })
    .post("/chat/stream", async ({ body, set }) => {
        try {
            const { response } = await chatStream(body);
            return response;
        } catch (error) {
            const fallbackRequestId = `ai_${Date.now()}`;
            const { status, body: errorBody } = buildErrorResponse(error, fallbackRequestId);
            set.status = status;
            return errorBody;
        }
    }, {
        body: chatStreamBodySchema,
        response: {
            400: apiErrorResponseSchema,
            500: apiErrorResponseSchema,
            502: apiErrorResponseSchema,
            504: apiErrorResponseSchema,
        },
        detail: {
            tags: ["vercel"],
            summary: "streamText 流式聊天测试",
            description: "基于 Vercel AI SDK 的 streamText 能力提供流式聊天输出",
        },
    });
