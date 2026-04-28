export const PROMPT_MODULES = ['system', 'chat', 'practice', 'video'] as const
export type PromptModule = (typeof PROMPT_MODULES)[number]

export interface PromptDescriptor {
  module: PromptModule
  description: string
  value: string
}

// ─────────────────────────────────────────────────────────────────────────────
//    静态默认配置对象（数据与类分离）
//    通过 satisfies 约束每个值符合 PromptDescriptor，同时保留字面量类型推断，
//    使 OverridablePromptKey 可直接从 keyof 中精确推导，无需手动维护。
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_PROMPTS = {
  mainSystemPrompt: {
    module: 'system',
    description: '主系统提示词',
    value: `
# 角色描述
你是德州扑克教练，根据用户的提问，进行回复。拒绝回答与德州扑克无关的问题。

# 功能限制
- 尽量简洁，不输出无关内容。
- 你的输出不允许包含和业务相关的代码以及 ID 等字眼，要保证用户可以理解。
- 针对工具调用的结果，只需要做个归纳性的总结，不要输出工具调用的具体内容。`,
  },
  recommendVideoToolPrompt: {
    module: 'video',
    description: '推荐视频工具提示词',
    value: `
# 工具描述
如果用户想看教学视频，推荐视频工具可以推荐视频列表给用户。

# 使用指南
- 如果用户只是简单地说 "推荐视频"， "查找视频"，或类似的模糊请求，调用该工具。
`,
  },
  openPracticeToolPrompt: {
    module: 'practice',
    description: '打开练习场工具提示词',
    value: `
# Tool Description:
Opens an AI Poker Practice Table.
Use this tool whenever the user wants to start a poker practice session, open a new practice table, or begin practicing poker scenarios.

# Usage Guidelines:
- If the user simply says "open a practice table", "start practicing", or similar vague requests, use all default values.
- If the user specifies partial configurations (e.g. "8 players", "blinds 5/10", "no straddle", "10 second timer"), only pass the mentioned parameters and keep the rest as defaults.
- The 'scenario' field can be used to create more targeted practice situations.

Always merge user-provided values with defaults and call the tool with the complete set of parameters.
  `,
  },
  openDrillToolPrompt: {
    module: 'practice',
    description: '打开 Drill 专项训练桌工具提示词',
    value: `
# Tool Description:
打开一个 Drill 专项练习场，支持选择 RFI、vsOpen 场景，可以练习单 pot 或 full hand(整手牌)模式，支持几个手数档位。

# Usage Guidelines:
- 当用户需要有针对性的 preflop 训练（RFI、vsOpen等）、“Drill”模式或结构化的特定场景练习，而不是通用的练习桌时使用。
- 将用户意图映射到 \`preflopActions\` 字段：包括 \`RFI\` 用于率先加注场景；包括 \`vsOpen\` 用于面对开局加注场景。如果用户不指定线路，使用默认值。
- 设置 \`gameModel\` 字段为 \`spot\` 用于单决策点训练，或 \`fullHand\` 用于整手牌训练。如果用户不指定，使用默认值。
`,
  },
} satisfies Record<string, PromptDescriptor>

// ─────────────────────────────────────────────────────────────────────────────
//  类型从静态配置精确推导，新增 prompt 条目后自动同步，无需手动维护
// ─────────────────────────────────────────────────────────────────────────────
export type OverridablePromptKey = keyof typeof DEFAULT_PROMPTS
export type PromptProviderOverrides = Partial<Record<OverridablePromptKey, string>>

// ─────────────────────────────────────────────────────────────────────────────
//  Provider 类只负责状态管理与覆盖逻辑
// ─────────────────────────────────────────────────────────────────────────────
export class PromptProvider {
  /**
   * 深拷贝默认配置，防止 applyOverrides 污染全局 DEFAULT_PROMPTS
   */
  public prompts = structuredClone(DEFAULT_PROMPTS)

  /**
   * 将外部传入的覆盖值应用到当前实例
   * @param overrides - 需要覆盖的提示词键值对
   * @returns this，支持链式调用
   */
  applyOverrides(overrides: PromptProviderOverrides) {
    for (const key of Object.keys(overrides) as OverridablePromptKey[]) {
      const newValue = overrides[key]
      if (newValue) {
        // 不传或者传空字符串，都不算覆盖
        this.prompts[key].value = newValue
      }
    }
    return this
  }
}

export const promptProviderInst = new PromptProvider()

/**
 * 创建一个带覆盖值的 PromptProvider 实例
 * @param overrides - 可选的提示词覆盖配置
 */
export function createPromptProvider(overrides?: PromptProviderOverrides) {
  return new PromptProvider().applyOverrides(overrides || {})
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 分组工具函数
// ─────────────────────────────────────────────────────────────────────────────
export type PromptDescriptorItem = PromptDescriptor & { key: string }

export type GroupedPrompts = Record<PromptModule, PromptDescriptorItem[]>

/**
 * 获取按模块分组的所有提示词列表
 * @param promptProvider - 可选，默认使用全局单例
 * @returns 按 PromptModule 分组的提示词数组
 */
export function getPromptProviderPrompts(
  promptProvider: PromptProvider = promptProviderInst
): GroupedPrompts {
  const grouped = PROMPT_MODULES.reduce((acc, mod) => {
    acc[mod] = []
    return acc
  }, {} as GroupedPrompts)

  for (const [key, descriptor] of Object.entries(promptProvider.prompts)) {
    grouped[descriptor.module].push({ key, ...descriptor })
  }

  return grouped
}
