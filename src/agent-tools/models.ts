/**
 * 本地调试使用模型
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { wrapLanguageModel } from 'ai'
import { customMiddleware } from './middleware'

const openai = createOpenAI({
  baseURL: 'http://127.0.0.1:8000/v1',
  apiKey: '',
})

export const baseModel = wrapLanguageModel({
  model: openai.chat('gemma4'),
  middleware: customMiddleware,
})

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// export const geminiFlashLiteModel = wrapLanguageModel({
//   model: googleProvider("gemini-3.1-flash-lite-preview"),
//   middleware: customMiddleware,
// })
export const geminiFlashLiteModel = wrapLanguageModel({
  model: googleProvider('gemini-2.5-flash'),
  middleware: customMiddleware,
})

export const geminiFlashModel = wrapLanguageModel({
  // model: googleProvider('gemini-2.5-flash'),
  // model: googleProvider('gemini-3.1-flash-lite-preview'), // 完全不能用
  model: googleProvider('gemini-3-flash-preview'), // 输出合法牌谱，经常出现rpc2卡住
  // model: googleProvider('gemini-3-pro-preview'), // 输出合法牌谱，经常出现rpc2卡住
  // model: googleProvider('gemini-2.5-pro'), // 前进了一点，前端会看到工具返回结果信息， 不过也会再第二步卡死
  middleware: customMiddleware,
})

/**
 * DeepSeek 使用 OpenAI 兼容接口，通过 baseURL 切换到 DeepSeek 服务
 */
const deepseekProvider = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
})

/**
 * DeepSeek 通用对话模型
 */
export const deepseekChatModel = wrapLanguageModel({
  // model: deepseekProvider.chat('deepseek-reasoner'),
  model: deepseekProvider.chat('deepseek-chat'),
  // model: deepseekProvider.chat('deepseek-v4-flash'),
  // model: deepseekProvider.chat('deepseek-v4-pro'),
  middleware: customMiddleware,
})