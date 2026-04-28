import type { LanguageModelMiddleware } from 'ai'

export const customMiddleware: LanguageModelMiddleware = {
  specificationVersion: 'v3',
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('--> wrapGenerate: ', JSON.stringify(params, null, 2))
    const result = await doGenerate()
    return result
  },
  wrapStream: async ({ doStream, params }) => {
    const { prompt } = params
    const logInfo = { prompt }
    console.log('--> wrapStream: ', JSON.stringify(logInfo, null, 2))
    const result = await doStream()
    return result
  },
}
