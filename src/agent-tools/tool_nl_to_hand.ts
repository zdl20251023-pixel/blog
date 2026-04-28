import { tool } from "ai";
import { z } from "zod";
import { POSITION_MAPPING } from "../config/config.default";
import { PromptProvider } from "./prompt-provider";

/**
 * 单个行动记录 (符合 5-最新牌谱.md)
 */
const HandActionSchema = z
  .object({
    action: z
      .string()
      .describe(
        "动作类型或发牌字符串。" +
          "① 若是玩家动作，必须属于 raise / call / fold / check / bet / allin 之一。注意：postflop 场上已有人下注时，用 raise 而非 bet。" +
          '② 若是发公共牌（此时必须 seat_no=-1且 amount=0），则 action 字段直接填入紧凑牌面字符串！绝对不要填 "-1" 或 "board"！' +
          '  - 翻牌示例: "4cAcQc"' +
          '  - 转牌示例: "5d"' +
          '  - 河牌示例: "6d"'
      ),
    seat_no: z
      .number()
      .int()
      .min(-1)
      .max(8)
      .describe("执行动作的玩家座位号。公共牌发牌时必须为 -1。"),
    amount: z
      .number()
      .int()
      .min(0)
      .describe(
        "动作金额（整数）。" +
          "raise/bet 时为加注/下注到的总额（不是增量，是累计投入总量）；" +
          "call 时为需要补齐的差额（= maxBet - 自己已投入）；" +
          "check/fold 时为 0；" +
          "allin 时为 0（引擎自动计算）。" +
          "示例：big_blind=2，UTG open 默认 amount=6（3BB）；" +
          "对方 raise 到 6 后 3-bet 默认 amount=18（3×6）；" +
          "call 对方 raise 6（自己已 post SB=1）时 amount=5。"
      ),
  })
  .strict();

/**
 * 玩家信息 (符合 5-最新牌谱.md)
 */
const POSITION_TAG_SET = new Set(Object.values(POSITION_MAPPING).flat());

const HandPlayerSchema = z
  .object({
    id: z
      .number()
      .int()
      .min(1)
      .describe(
        "玩家唯一ID，从1开始递增，按seat_no从小到大分配：seat_no=0→id=1, seat_no=1→id=2，依此类推。"
      ),
    seat_no: z
      .number()
      .int()
      .min(0)
      .max(8)
      .describe(
        "座位号，范围 [0, 人数-1]。players 数组必须按 seat_no 从小到大排序。"
      ),
    stack: z
      .number()
      .int()
      .min(0)
      .describe(
        "起始筹码（整数）。未指定时默认=big_blind×100。例如 big_blind=2 时默认 200。"
      ),
    name: z
      .string()
      .describe(
        "展示用名称。规则：持有已知手牌(hold_cards非空)的玩家固定为 HERO；" +
          "其余固定为 opp_{seat_no}（如 seat_no=4 则 name=opp_4）。" +
          "禁止用 BTN/SB/BB/UTG/HJ/CO 等位置词作为 name。"
      ),
    position_tag: z
      .string()
      .refine((v) => POSITION_TAG_SET.has(v), {
        message: `position_tag 非法，必须属于 POSITION_MAPPING 定义集合: ${[
          ...POSITION_TAG_SET,
        ].join("/")}`,
      })
      .describe(
        "位置标签（强约束）。必须根据 dealer_seat 和人数，按 POSITION_MAPPING 顺时针推导得出。" +
          "例：6人桌 dealer_seat=0 时，seat_no 依次为 0→BTN, 1→SB, 2→BB, 3→UTG, 4→HJ, 5→CO。" +
          "2人桌时只有 SB/BTN（庄家兼小盲）和 BB 两个标签。"
      ),
    hold_cards: z
      .string()
      .describe(
        '两张手牌紧凑写法（如 AhKd）。未知手牌填空字符串 ""。' +
          "每张牌格式=Rank+Suit，Rank∈{2-9,T,J,Q,K,A}，Suit∈{h,d,c,s}。"
      ),
  })
  .strict();

/**
 * 结算玩家信息 (符合 5-最新牌谱.md)
 */
const HandResultPlayerSchema = z
  .object({
    seat_no: z.number().int().min(0).max(8).describe("座位号"),
    stack: z
      .number()
      .int()
      .min(0)
      .describe(
        "结算后筹码。" +
          "【推荐】填 0 表示委托引擎自动计算，工具会在返回中给出正确值，完全无需手动计算，可消除 SETTLEMENT_MISMATCH 错误。" +
          "【可选】自行填写非零值，引擎会与模拟结果比对，不符时触发 SETTLEMENT_MISMATCH。" +
          "牌局未结束时（动作序列未到结算阶段）：stack 一律填 0。"
      ),
    hold_cards: z.string().describe("亮牌显示手牌，未亮牌可为空字符串。"),
  })
  .strict();

/**
 * 牌谱对象（Latest Hand 结构）
 */
export const LatestHandSchema = z
  .object({
    gameuuid: z.string().describe("唯一牌局标识，如果没有则随机生成一个"),
    players: z
      .array(HandPlayerSchema)
      .min(2)
      .max(9)
      .describe(
        "参与玩家列表。必须按 seat_no 从小到大排序。未指定人数时默认 6 个人"
      ),
    big_blind: z.number().int().min(1).default(2).describe("大盲注金额，默认2"),
    ante: z.number().int().min(0).default(0).describe("前注金额，默认0"),
    dealer_seat: z
      .number()
      .int()
      .min(0)
      .max(8)
      .default(0)
      .describe("庄家（BTN）位座位号，默认0"),
    sb_seat: z
      .number()
      .int()
      .min(0)
      .max(8)
      .default(1)
      .describe("小盲（SB）位座位号，必须是 BTN 顺时针下一位"),
    bb_seat: z
      .number()
      .int()
      .min(0)
      .max(8)
      .default(2)
      .describe("大盲（BB）位座位号，必须是 SB 顺时针下一位"),
    roomid: z.string().describe("房间/桌子 ID，如果没有则随机生成一个"),
    straddle_seat: z
      .number()
      .int()
      .min(-1)
      .max(8)
      .default(-1)
      .describe(
        "Straddle 座位号，无则填 -1。注意：少于4人桌不允许开启 Straddle。"
      ),
    actions: z.array(HandActionSchema).describe("行动流水记录，必须按顺序执行"),
    result: z
      .object({
        players: z
          .array(HandResultPlayerSchema)
          .min(2)
          .describe(
            "结算时的玩家状态列表，按座位号从小到大排列。" +
              "推荐所有 stack 填 0，让引擎自动计算，避免 SETTLEMENT_MISMATCH。"
          ),
      })
      .strict()
      .describe(
        "结算结果。推荐 result.players[*].stack 全部填 0，引擎自动计算并在返回中给出正确值。"
      ),
  })
  .strict()
  .describe("牌谱对象（Latest Hand 结构）");

/** 牌谱类型（供模拟器子模块直接引用） */
export type LatestHandType = z.infer<typeof LatestHandSchema>;

type ToolOptionsType = {
  promptProvider: PromptProvider;
  userId?: number;
};

/**
 * nl_to_hand 工具：根据用户自然语言描述生成并校验结构化牌谱
 *
 * 内部采用四层校验流水线：
 *   Layer 1  Zod Schema 结构校验
 *   Layer 2  语义预校验（牌面唯一性、座位合法性等）
 *   Layer 3  动态推演（逐行动回放，复用 isCanOperAction + executePlayerAction）
 *   Layer 4  结算校验（resolveShowdownTimeline + 筹码守恒 + result 对比）
 */
export function createNlToHandTool(_options: ToolOptionsType) {
  return tool({
    description: `【工具用途】
将用户的自然语言扑克牌局描述转换为结构化牌谱 JSON，并进行四层合法性校验。
若校验不通过，返回详细的多行诊断报告，按 [修复建议] 中的 fix_path 和 fix 精准修改后重新调用。

【强制执行步骤 —— 每步必须在 _reasoning 中写出中间结果】

Step 1 · 确定基础参数
  - 人数（默认6）、big_blind（默认2）、ante（默认0）、straddle（默认无，<4人不可开）
  - 输出：playerCount=N, BB=X, ante=Y

Step 2 · 分配座位与位置
  - dealer_seat（默认0）→ 按人数顺时针映射 POSITION_MAPPING
  - 输出座位映射表：seat_no → position_tag
  - dealer_seat=0 时各人数的标签映射规定（如果 dealer_seat 不是 0，则整体按顺时针循环移位）：
    2人桌：0→SB/BTN, 1→BB
    3人桌：0→BTN, 1→SB, 2→BB
    4人桌：0→BTN, 1→SB, 2→BB, 3→UTG
    5人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→CO
    6人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→HJ, 5→CO
    7人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→LJ, 5→HJ, 6→CO
    8人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→UTG1, 5→LJ, 6→HJ, 7→CO
    9人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→UTG1, 5→UTG2, 6→LJ, 7→HJ, 8→CO
    10人桌：0→BTN, 1→SB, 2→BB, 3→UTG, 4→UTG1, 5→UTG2, 6→UTG3, 7→LJ, 8→HJ, 9→CO

Step 3 · 填充玩家列表
  - 确定 HERO 座位（hold_cards 非空的玩家）
  - 其余玩家 name=opp_{seat_no}，hold_cards=""
  - id 从1开始按 seat_no 顺序递增（seat_no=0→id=1，seat_no=1→id=2，...）
  - 按 seat_no 从小到大排序
  - stack 未指定时默认 big_blind×100

Step 4 · 推演行动序列
  - preflop：首个行动者为 UTG（bb_seat 顺时针下一个）
  - postflop：首个行动者为 BTN 顺时针下一个（通常为 SB 位）
  - 每步必须写出：当前应行动座位 → 该座位动作
  - 遇到"其他人弃牌"时，逐个补全中间玩家的 fold（禁止跳位）
  - 每一轮（下注轮）闭合后才能发公共牌（seat_no=-1）
  - call 的 amount = currentMaxBet - 自己已投入；raise/bet 的 amount = 加注到的总额

Step 5 · 计算结算
  - 推荐：所有 result.players[*].stack 填 0，引擎自动计算并在返回中给出正确值
  - 若手动填写：赢家 stack = 初始筹码 - 投入总额 + 赢取金额

【强制降级与脑补规范：绝对不要因信息缺失而拒绝调用！】
如果用户意图生成牌谱，但描述极度模糊或不完整（如不知道盲注大小、不知道谁加注、跳过中间玩家等），绝对禁止以“信息不足”为由拒绝调用工具或反问用户！
你必须立即调用工具，并遵循以下标准脑补所有缺失信息，然后在回复中告知用户你做了哪些假设：
- 未说明盲注大小：默认 BB=2，ante=0。
- 未说明部分对手身份或具体是谁：自动挑选最符合逻辑的未知位置填入（如默认假想敌为 BTN 或某个 limper）。
- 未指明部分花色：随机安排不冲突的合法花色。
- 未说明具体金额：
  ① preflop open-raise 默认 amount = BB × 3
  ② 3-bet（面对别人 raise 后再加注）默认 amount = 对方 raise 额 × 3
  ③ call 默认 amount = 当前最高下注 - 自己已投入
  ④ bet（postflop 没人下注时）默认 amount = 当前 pot 的 50%
- 未说明某些动作顺序或跳过了中间玩家：自动强行用合理的 fold 或 call 动作填补空白玩家的轮次。
【常见致命错误警告（必须避免！）】
1. 字段拼写错误：手牌字段必须且只能是 "hold_cards"，绝不允许写成 "hold_calls"！
2. 缺少必要动作：postflop 阶段必须遵循 action 必须对应当前轮的原则，不要跳过或遗漏玩家行动！
3. 人工计算错误：不要自己去加减乘除算结果筹码，全部 result.players.stack 请放心填 0 委托给引擎！
4. 牌面绝对不能重复：一副标准扑克牌中每张牌（如 Ks）只有一张！在写公共牌 (action 字符串) 时，必须仔细检查该牌是否已经存在于任何玩家的 "hold_cards" 中，反之亦然。发牌前请务必在 _reasoning 中自我查重！

【格式示例 —— 6人局完整示例（格式照此，数值按用户描述调整）】
{
  "gameuuid":"uuid-001","roomid":"room-001","big_blind":2,"ante":0,
  "dealer_seat":0,"sb_seat":1,"bb_seat":2,"straddle_seat":-1,
  "players":[
    {"id":1,"seat_no":0,"stack":200,"name":"opp_0","position_tag":"BTN","hold_cards":""},
    {"id":2,"seat_no":1,"stack":200,"name":"opp_1","position_tag":"SB","hold_cards":""},
    {"id":3,"seat_no":2,"stack":200,"name":"opp_2","position_tag":"BB","hold_cards":""},
    {"id":4,"seat_no":3,"stack":200,"name":"HERO","position_tag":"UTG","hold_cards":"AhAs"},
    {"id":5,"seat_no":4,"stack":200,"name":"opp_4","position_tag":"HJ","hold_cards":""},
    {"id":6,"seat_no":5,"stack":200,"name":"opp_5","position_tag":"CO","hold_cards":""}
  ],
  "actions":[
    {"action":"raise","seat_no":3,"amount":6},
    {"action":"fold","seat_no":4,"amount":0},
    {"action":"fold","seat_no":5,"amount":0},
    {"action":"fold","seat_no":0,"amount":0},
    {"action":"fold","seat_no":1,"amount":0},
    {"action":"fold","seat_no":2,"amount":0}
  ],
  "result":{"players":[
    {"seat_no":0,"stack":0,"hold_cards":""},
    {"seat_no":1,"stack":0,"hold_cards":""},
    {"seat_no":2,"stack":0,"hold_cards":""},
    {"seat_no":3,"stack":0,"hold_cards":"AhAs"},
    {"seat_no":4,"stack":0,"hold_cards":""},
    {"seat_no":5,"stack":0,"hold_cards":""}
  ]}
}

【修复规则（收到"不合法"后必须遵守）】
1. 仅修改 [修复建议] 中 fix_path 指定的字段。
2. 其余字段保持原值完全不变，禁止在修复时改动其他字段。
3. 按 fix 建议修改后，用完整 game_hand JSON 重新调用本工具，直到返回"合法"。

【返回格式】
合法时：一行字符串"合法"，并附带 [引擎结算结果] JSON（若引擎自动计算了结算值）。
不合法时：多行诊断报告，包含 [错误码][出错位置][错误原因][桌面快照][修复建议]。
`,
    inputSchema: z.object({
      _reasoning: z
        .string()
        .describe(
          "【强制推理步骤 —— 生成前必须在此写出以下内容】\\n" +
            "(1) 用户意图解析：牌局描述中涉及到的人数、位置、行动信息；\\n" +
            "(2) 座位-位置映射表：dealer_seat=N 时，每个座位对应的 position_tag；\\n" +
            "(3) preflop 行动顺序推演：从 UTG 开始逐位列出（含中间 fold）；\\n" +
            "(4) 投入与结算：描述各玩家投入（或说明使用 stack=0 委托引擎计算）；\\n" +
            "(5) 全局查重与字段拼写自检：必须在此回答 ①是否有重复牌面（如公共牌发出Ks，手牌也有Ks？） ②所输出JSON的所有字段名是否与定义严格一致（绝不能拼错或捏造未定义字段，例如把 hold_cards 错拼成 hold_calls）？"
        )
        .optional(),
      game_hand: LatestHandSchema.describe(
        "待校验的牌谱对象（必须符合 latest hand 结构）。"
      ),
    }),
    execute: ({ game_hand }) => {
      console.info(
        `============> createNlToHandTool.game_hand: ${JSON.stringify(
          game_hand,
          null,
          2
        )}`
      );
      try {
        // Layer 1：Zod Schema 结构校验（inputSchema 已处理，这里显式二次确认）
        const parseResult = LatestHandSchema.safeParse(game_hand);
        if (!parseResult.success) {
          const firstError = parseResult.error.issues[0];
          if (!firstError) {
            return "不合法: 未知 Schema 校验错误";
          }
          const path = firstError.path.join(".");
          return `不合法\n[错误码] SCHEMA_INVALID\n[出错位置] ${path}\n[错误原因] ${firstError.message}\n[修复建议] fix_path=${path} | fix=检查并修正该字段的值和格式`;
        }

        return `合法`;
      } catch (error) {
        return `不合法: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    },
  });
}
