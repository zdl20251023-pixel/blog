
## json数据

- 顶层分为四块：`table`（牌桌与本手上下文）、`players`（开局快照）、`hand_history`（本手时间线）、`summary`（终局汇总：亮牌与筹码）。
- `hand_history` 中每条为判别联合：`type: "player_action"`（玩家操作，含 `street`）或 `type: "board"`（公共牌，含 `street` 与 `cards`）。
- **牌面字符串**（`hold_cards`、`board.cards`）须符合下文 [牌面编码（德州扑克）](#牌面编码德州扑克) 规则。

```json
{
  "table": {
    "roomid": "table_26689556230160389",
    "gameuuid": "card_26689556754448389",
    "big_blind": 10,
    "ante": 5,
    "dealer_seat": 5,
    "sb_seat": 0,
    "bb_seat": 1,
    "straddle_seat": -1
  },
  "players": [
    {
      "id": "9",
      "seat_no": 0,
      "stack": 1000,
      "name": "Rui Cao",
      "hold_cards": "Tc5c"
    },
    {
      "id": "10",
      "seat_no": 1,
      "stack": 1000,
      "name": "Danny Tang",
      "hold_cards": "Kc6c"
    },
    {
      "id": "11",
      "seat_no": 2,
      "stack": 1000,
      "name": "Elton Tsang",
      "hold_cards": "As9d"
    },
    {
      "id": "12",
      "seat_no": 3,
      "stack": 1000,
      "name": "Phil Ivey",
      "hold_cards": "5sQd"
    },
    {
      "id": "13",
      "seat_no": 4,
      "stack": 1000,
      "name": "St Wang",
      "hold_cards": "9cQh"
    },
    {
      "id": "14",
      "seat_no": 5,
      "stack": 1000,
      "name": "Jungleman",
      "hold_cards": "2hQs"
    }
  ],
  "hand_history": [
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 2,
      "action": "raise",
      "amount": 30
    },
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 3,
      "action": "fold",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 4,
      "action": "call",
      "amount": 30
    },
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 5,
      "action": "fold",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 0,
      "action": "call",
      "amount": 30
    },
    {
      "type": "player_action",
      "street": "preflop",
      "seat_no": 1,
      "action": "call",
      "amount": 30
    },
    {
      "type": "board",
      "street": "flop",
      "cards": "4cAcQc"
    },
    {
      "type": "player_action",
      "street": "flop",
      "seat_no": 0,
      "action": "check",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "flop",
      "seat_no": 1,
      "action": "check",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "flop",
      "seat_no": 2,
      "action": "check",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "flop",
      "seat_no": 4,
      "action": "check",
      "amount": 0
    },
    {
      "type": "board",
      "street": "turn",
      "cards": "5d"
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 0,
      "action": "check",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 1,
      "action": "check",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 2,
      "action": "bet",
      "amount": 35
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 4,
      "action": "call",
      "amount": 35
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 0,
      "action": "raise",
      "amount": 290
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 1,
      "action": "call",
      "amount": 290
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 2,
      "action": "fold",
      "amount": 0
    },
    {
      "type": "player_action",
      "street": "turn",
      "seat_no": 4,
      "action": "fold",
      "amount": 0
    },
    {
      "type": "board",
      "street": "river",
      "cards": "6d"
    },
    {
      "type": "player_action",
      "street": "river",
      "seat_no": 0,
      "action": "bet",
      "amount": 540
    },
    {
      "type": "player_action",
      "street": "river",
      "seat_no": 1,
      "action": "allin",
      "amount": 675
    },
    {
      "type": "player_action",
      "street": "river",
      "seat_no": 0,
      "action": "call",
      "amount": 675
    }
  ],
  "summary": {
    "players": [
      {
        "seat_no": 0,
        "stack": 0,
        "hold_cards": "Tc5c"
      },
      {
        "seat_no": 1,
        "stack": 2150,
        "hold_cards": "Kc6c"
      },
      {
        "seat_no": 2,
        "stack": 930,
        "hold_cards": ""
      },
      {
        "seat_no": 3,
        "stack": 995,
        "hold_cards": ""
      },
      {
        "seat_no": 4,
        "stack": 930,
        "hold_cards": ""
      },
      {
        "seat_no": 5,
        "stack": 995,
        "hold_cards": ""
      }
    ]
  }
}
```

## 牌面编码（德州扑克）

本牌谱使用 **无分隔符拼接**：每张牌为 **2 个字符**（`rank` + `suit`），多张牌按发牌顺序直接相连。对应的 **TypeBox 常量与 `pattern` 写法** 见下文 [schema定义](#schema定义) 中的代码块。

### 字符集

| 部分 | 允许字符 | 说明 |
|------|----------|------|
| 点数 `rank` | `2 3 4 5 6 7 8 9` **`T`** `J Q K A` | 大写；**`T` 表示 10**。 |
| 花色 `suit` | **`c` `d` `h` `s`** | 小写：clubs / diamonds / hearts / spades。 |

单张牌在正则中记为：`^[2-9TJQKA][cdhs]$`。

### 底牌 `hold_cards`（含 `summary.players`）

- 德州每人 **2 张** hole cards。
- **空字符串 `""`**：未知、未发齐、或未亮牌（常见于 `summary`）。
- **非空**：必须为 **4 个字符**，即两张合法单牌拼接，整体满足 `^(?:[2-9TJQKA][cdhs]){2}$`（下文 schema 代码块中的 `POKER_HOLE_CARDS_PATTERN`）。
- **同一 `hold_cards` 内两张牌不得相同**（如 `AhAh` 非法）；正则无法保证，须在应用层校验。
- **跨玩家、跨公共牌不得出现同一张物理牌**（例如底牌与 board 重复）；须结合整手 `players` + `hand_history` 在应用层校验。

### 公共牌 `board.cards`

| `street` | 德州规则 | `cards` 格式 |
|----------|----------|----------------|
| `flop` | 3 张公共牌 | **6 字符**，`^(?:[2-9TJQKA][cdhs]){3}$`，例 `4cAcQc`。 |
| `turn` | 1 张 | **2 字符**，单张牌 pattern，例 `5d`。 |
| `river` | 1 张 | **2 字符**，同上，例 `6d`。 |

- **flop → turn → river 已发出的 5 张公共牌互不相同**；须沿 `hand_history` 中 `type: "board"` 事件顺序在应用层校验。

---

## schema定义

以下为 **牌谱规范** 的 Elysia TypeBox 写法（含牌面 `pattern`、按 `street` 拆分的 `board` 联合类型），**以本文档为唯一权威**。

`src/modules/poker/model.ts` 仅导出**宽松结构**（`hold_cards` / `board.cards` 为 `t.String()`），便于路由快速校验形态；若要在运行时落实牌面规则，可复制下文常量与 `poker_hole_cards`、`hand_history_board` 定义到业务代码，或单独实现校验函数并对照本节。

```typescript
import { t } from "elysia";

/** 单张牌：JSON Schema pattern */
export const POKER_CARD_PATTERN = "^[2-9TJQKA][cdhs]$";
/** 德州两张底牌拼接（4 字符） */
export const POKER_HOLE_CARDS_PATTERN = "^(?:[2-9TJQKA][cdhs]){2}$";
/** flop 三张公共牌拼接（6 字符） */
export const POKER_FLOP_CARDS_PATTERN = "^(?:[2-9TJQKA][cdhs]){3}$";

/** 底牌 / summary 亮牌：空串 或 合法 4 字符（同串内两牌不重复须应用层校验） */
export const poker_hole_cards = t.Union([
  t.Literal(""),
  t.String({ pattern: POKER_HOLE_CARDS_PATTERN }),
]);

/** 一条街：preflop / flop / turn / river */
export const poker_street = t.Union([
  t.Literal("preflop"),
  t.Literal("flop"),
  t.Literal("turn"),
  t.Literal("river"),
]);

/** 发出公共牌时仅 flop、turn、river（无 preflop） */
export const poker_board_street = t.Union([
  t.Literal("flop"),
  t.Literal("turn"),
  t.Literal("river"),
]);

/** 玩家动作动词；平台若还有其它动词可在此扩展 */
export const poker_action_verb = t.Union([
  t.Literal("raise"),
  t.Literal("call"),
  t.Literal("fold"),
  t.Literal("check"),
  t.Literal("bet"),
  t.Literal("allin"),
]);

/** 牌桌与本手上下文 */
export const poker_hand_table = t.Object({
  roomid: t.String({ description: "房间/桌子 id" }),
  gameuuid: t.String({ description: "本手牌唯一 id" }),
  big_blind: t.Integer({ minimum: 0, description: "大盲注筹码" }),
  ante: t.Integer({ minimum: 0, description: "前注（每人）" }),
  dealer_seat: t.Integer({ description: "庄家座位号" }),
  sb_seat: t.Integer({ description: "小盲座位号" }),
  bb_seat: t.Integer({ description: "大盲座位号" }),
  straddle_seat: t.Integer({ description: "straddle 座位，无则为 -1" }),
});

/** 开局时一名玩家的快照 */
export const poker_hand_player_snapshot = t.Object({
  id: t.String({ description: "玩家 id" }),
  seat_no: t.Integer({ minimum: 0, description: "座位号" }),
  stack: t.Integer({ minimum: 0, description: "起始筹码" }),
  name: t.String({ description: "显示名" }),
  hold_cards: poker_hole_cards,
});

/** hand_history 中单条：玩家操作 */
export const hand_history_player_action = t.Object({
  type: t.Literal("player_action"),
  street: poker_street,
  seat_no: t.Integer({ minimum: 0 }),
  action: poker_action_verb,
  amount: t.Integer({ minimum: 0 }),
});

/** hand_history 中单条：发出公共牌（按 street 约束 cards） */
export const hand_history_board = t.Union([
  t.Object({
    type: t.Literal("board"),
    street: t.Literal("flop"),
    cards: t.String({ pattern: POKER_FLOP_CARDS_PATTERN }),
  }),
  t.Object({
    type: t.Literal("board"),
    street: t.Literal("turn"),
    cards: t.String({ pattern: POKER_CARD_PATTERN }),
  }),
  t.Object({
    type: t.Literal("board"),
    street: t.Literal("river"),
    cards: t.String({ pattern: POKER_CARD_PATTERN }),
  }),
]);

/** 时间线元素：由 type 区分的判别联合 */
export const hand_history_event = t.Union([
  hand_history_player_action,
  hand_history_board,
]);

/** summary 中每名玩家的终局信息 */
export const poker_summary_player = t.Object({
  seat_no: t.Integer({ minimum: 0 }),
  stack: t.Integer({ minimum: 0 }),
  hold_cards: poker_hole_cards,
});

/** 本手结束汇总 */
export const poker_hand_summary = t.Object({
  players: t.Array(poker_summary_player),
});

/** 完整一手牌牌谱 */
export const poker_hand_record = t.Object({
  table: poker_hand_table,
  players: t.Array(poker_hand_player_snapshot),
  hand_history: t.Array(hand_history_event),
  summary: poker_hand_summary,
});

export type poker_hand_record_type = typeof poker_hand_record.static;

```

| 块 | 说明 |
|----|------|
| `table` | 房间/桌子 id、本手牌 uuid、大盲/ante、庄家与盲注位、straddle 座位（无则为 -1）。 |
| `players` | 开局时每位玩家的 id（字符串）、座位、昵称、起始筹码、`hold_cards`（见 [牌面编码](#牌面编码德州扑克)）。 |
| `hand_history` | 按时间顺序的事件数组，每项通过 `type` 区分：<br>**`player_action`**：`street`（`preflop` \| `flop` \| `turn` \| `river`）、`seat_no`、`action`（仅玩家动词：`raise`/`call`/`fold`/`check`/`bet`/`allin` 等）、`amount`。<br>**`board`**：`street` 与 `cards` 联合约束：`flop` 为 6 字符三张拼接；`turn`/`river` 各为 2 字符单张（规则见 [牌面编码](#牌面编码德州扑克)）。 |
| `summary` | 终局汇总：每位座位最终筹码、`hold_cards`（空或未亮、或 4 字符亮牌，规则同上）；后续可扩展边池、赢家、抽水等字段。 |

- **严格牌面与 pattern**：以上文「牌面编码」与 **本节 TypeBox 代码块** 为准；需要落库/API 强校验时，在业务层采用与文档一致的 schema 或校验函数。
