import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  AI_ERROR_CODE,
  type ApiErrorResponse,
  type ChatMessage,
  type ChatStreamRequest,
  STREAM_CHAT_DEFAULTS,
} from "./model";

/**
 * AI 业务错误类
 */
export class VercelAiServiceError extends Error {
  code: string;
  status: number;
  requestId: string;

  constructor(message: string, code: string, status: number, requestId: string) {
    super(message);
    this.name = "VercelAiServiceError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

/**
 * 生成请求追踪 id
 */
const createRequestId = (): string => {
  return `ai_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * 将业务异常转换为统一错误响应
 */
export const buildErrorResponse = (error: unknown, requestId: string): { status: number; body: ApiErrorResponse } => {
  if (error instanceof VercelAiServiceError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      },
    };
  }

  return {
    status: 500,
    body: {
      code: AI_ERROR_CODE.INTERNAL_ERROR,
      message: "服务内部错误",
      requestId,
    },
  };
};

/**
 * 确认环境变量是否齐全
 */
type ProviderName = "gemini" | "deepseek";

const resolveProviderByServerConfig = (requestId: string): ProviderName => {
  const provider = STREAM_CHAT_DEFAULTS.activeProvider.toLowerCase();
  if (provider === "gemini" || provider === "deepseek") {
    return provider;
  }
  throw new VercelAiServiceError(
    "ACTIVE_AI_PROVIDER 配置非法，仅支持 gemini 或 deepseek",
    AI_ERROR_CODE.AI_PROVIDER_INVALID,
    500,
    requestId
  );
};

/**
 * 按 provider 读取对应 key
 */
const getApiKeyByProvider = (provider: ProviderName, requestId: string): string => {
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;

  if (provider === "gemini") {
    const key = googleKey;
    if (!key) {
      throw new VercelAiServiceError("缺少 Google API Key，请配置 GOOGLE_GENERATIVE_AI_API_KEY", AI_ERROR_CODE.AI_CONFIG_MISSING, 500, requestId);
    }
    return key;
  }

  const key = deepseekKey;
  if (!key) {
    throw new VercelAiServiceError("缺少 DeepSeek API Key，请配置 DEEPSEEK_API_KEY", AI_ERROR_CODE.AI_CONFIG_MISSING, 500, requestId);
  }
  return key;
};

/**
 * 校验消息列表是否包含 user 角色消息
 */
const ensureUserMessage = (messages: ChatMessage[], requestId: string): void => {
  const hasUserMessage = messages.some((item) => item.role === "user");
  if (!hasUserMessage) {
    throw new VercelAiServiceError("messages 至少包含一条 user 消息", AI_ERROR_CODE.INVALID_REQUEST, 400, requestId);
  }
};

/**
{
  "messages": [
    {
      "role": "system",
      "content": "你是一个德州扑克教练"
    },
 {
      "role": "user",
      "content": "AA怎么玩"
    }
  ],
  "temperature": 0,
  "maxOutputTokens": 1
}
*/

/**
 * 发起 streamText 流式聊天
 */
export const chatStream = async (input: ChatStreamRequest): Promise<{ requestId: string; response: Response }> => {
  console.log("chatStream input", JSON.stringify(input, null, 2));
  const requestId = createRequestId();
  ensureUserMessage(input.messages, requestId);

  const provider = resolveProviderByServerConfig(requestId);
  const apiKey = getApiKeyByProvider(provider, requestId);
  console.log("provider", provider);
  const model = provider === "gemini"
    ? createGoogleGenerativeAI({ apiKey })(STREAM_CHAT_DEFAULTS.geminiModel)
    : createOpenAI({
      apiKey,
      baseURL: STREAM_CHAT_DEFAULTS.deepseekBaseURL,
    }).chat(STREAM_CHAT_DEFAULTS.deepseekModel);

  try {
    const result = streamText({
      model,
      messages: input.messages,
      abortSignal: AbortSignal.timeout(STREAM_CHAT_DEFAULTS.timeoutMs),
    });
    console.log("streamText result", JSON.stringify(result, null, 2));
    const response = result.toTextStreamResponse({
      headers: {
        "x-request-id": requestId,
        "x-ai-provider": provider,
      },
    });

    return { requestId, response };
  } catch (error) {
    console.error("streamText error", JSON.stringify(error, null, 2));
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new VercelAiServiceError("模型请求超时", AI_ERROR_CODE.AI_REQUEST_TIMEOUT, 504, requestId);
    }

    throw new VercelAiServiceError("模型请求失败", AI_ERROR_CODE.AI_REQUEST_FAILED, 502, requestId);
  }
};
