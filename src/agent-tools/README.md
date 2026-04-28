# PromptProvider 使用说明

为了支持动态调试 Prompt，所有可能被覆盖的提示词都应统一收敛到 `PromptProvider` 中，而不是在业务代码里直接硬编码。

`PromptProvider` 定义位于 `src/agent-tools/prompt-provider.ts`。

## 什么时候放进 PromptProvider

满足以下任一条件的 Prompt，建议放入 `PromptProvider`：

- 需要由前端调试或临时覆盖
- 可能随业务迭代频繁调整
- 属于系统提示词或工具描述这类核心 Prompt

不需要动态调整、且只在局部使用一次的固定文案，可以继续保留在本地实现中。

## 基本使用方式

在业务代码中，不要直接写死提示词，而应先获取 `PromptProvider` 实例，再通过实例属性读取对应 Prompt。

例如在 `PokerCoachService` 中：

```ts
const promptProvider = PokerCoachService.getPromptProvider()

streamText({
  system: promptProvider.mainSystemPrompt,
  tools: getBaseTools(promptProvider),
})
```

## 默认流程与覆盖流程

当前约定如下：

- 默认请求路径使用全局单例 `promptProviderInst`
- 当请求中带有 `promptProviderOverrides` 时，为该请求创建新的 `PromptProvider` 实例
- 临时实例只写入当前请求的 `LocalStorage`，不会污染全局单例

这样可以同时满足两个目标：

- 正常路径复用单例，减少不必要的对象创建
- 调试路径支持按请求覆盖 Prompt，且不会影响其他请求

## Tool 的定义方式

如果一个 Tool 的 `description` 也需要支持动态覆盖，不要把 Tool 定义成直接导出的静态常量，而应该写成接收 `PromptProvider` 的工厂函数。

推荐写法：

```ts
function createFooTool(promptProvider: PromptProvider) {
  return tool({
    description: promptProvider.fooToolPrompt,
    inputSchema: z.object({
      // ...
    }),
    execute: async () => {
      // ...
    },
  })
}
```

然后在工具集合中动态创建：

```ts
export function getBaseTools(promptProvider: PromptProvider) {
  return {
    foo: createFooTool(promptProvider),
  }
}
```

## 维护建议

- 新增可覆盖 Prompt 时，先在 `src/agent-tools/prompt-provider.ts` 的 `PromptProvider` 中增加字段，并同步更新 `PromptProviderOverrides`
- 为了让前端可以调试这个 Prompt，还需要同步更新：
  - `src/feature/poker-coach/model.ts` 中 `promptProviderOverrides` 的请求体字段
  - `src/agent-tools/prompt-provider.ts` 中 `getPromptProviderPrompts()` 的返回字段
  - `src/feature/poker-coach/model.ts` 中 `PromptProviderPromptsResp` 的响应字段
  - `doc/AI_Interface/API/PokerCoach/PokerCoach Prompt 调试接口说明.md` 中的字段说明和示例
