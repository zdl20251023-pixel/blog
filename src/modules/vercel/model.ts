import { t } from "elysia";

/**
 * 聊天消息角色类型
 */
export type ChatRole = "system" | "user" | "assistant";

/**
 * 单条聊天消息
 */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * 流式聊天请求体
 */
export interface ChatStreamRequest {
  messages: ChatMessage[];
}

/**
 * 统一错误响应结构
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
}

/**
 * 业务错误码定义
 */
export const AI_ERROR_CODE = {
  INVALID_REQUEST: "INVALID_REQUEST",
  AI_CONFIG_MISSING: "AI_CONFIG_MISSING",
  AI_PROVIDER_INVALID: "AI_PROVIDER_INVALID",
  AI_REQUEST_TIMEOUT: "AI_REQUEST_TIMEOUT",
  AI_REQUEST_FAILED: "AI_REQUEST_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

/**
 * 流式聊天接口请求体验证 schema
 */
export const chatStreamBodySchema = t.Object({
  messages: t.Array(
    t.Object({
      role: t.Union([t.Literal("system"), t.Literal("user"), t.Literal("assistant")]),
      content: t.String({ minLength: 1, maxLength: 8000 }),
    }),
    { minItems: 1, maxItems: 30 }
  ),
  temperature: t.Optional(t.Number({ minimum: 0, maximum: 1 })),
  maxOutputTokens: t.Optional(t.Number({ minimum: 1, maximum: 4096 })),
});

/**
 * 错误响应 schema
 */
export const apiErrorResponseSchema = t.Object({
  code: t.String(),
  message: t.String(),
  requestId: t.String(),
});

/**
 * streamText 默认参数
 */
export const STREAM_CHAT_DEFAULTS = {
  activeProvider: process.env.ACTIVE_AI_PROVIDER || "gemini",
  geminiModel: process.env.AI_GEMINI_MODEL || "gemini-3-flash-preview",
  deepseekModel: process.env.AI_DEEPSEEK_MODEL || "deepseek-chat",
  deepseekBaseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
  temperature: 0.7,
  maxOutputTokens: 512,
  timeoutMs: Number(process.env.AI_TIMEOUT_MS || 30000),
} as const;
