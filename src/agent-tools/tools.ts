import { PromptProvider } from "./prompt-provider";
import { createNlToHandTool } from "./tool_nl_to_hand";

type ToolOptionsType = {
  promptProvider: PromptProvider;
  userId?: number;
};

// ═══════════════════════════════════════════════════════════════════════
// 工具定义
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// 工具集合
// ═══════════════════════════════════════════════════════════════════════
export function getBaseTools(options: ToolOptionsType) {
  return {
    nl_to_hand: createNlToHandTool(options),
  };
}
