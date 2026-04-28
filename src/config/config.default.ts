// 位置映射, 2-10人局
export const POSITION_MAPPING: Record<number, string[]> = {
  2: ["BTN", "SB", "BB", "SB/BTN"],
  3: ["BTN", "SB", "BB"],
  4: ["BTN", "SB", "BB", "UTG"],
  5: ["BTN", "SB", "BB", "UTG", "CO"],
  6: ["BTN", "SB", "BB", "UTG", "HJ", "CO"],
  7: ["BTN", "SB", "BB", "UTG", "LJ", "HJ", "CO"],
  8: ["BTN", "SB", "BB", "UTG", "UTG1", "LJ", "HJ", "CO"],
  9: ["BTN", "SB", "BB", "UTG", "UTG1", "UTG2", "LJ", "HJ", "CO"],
  10: ["BTN", "SB", "BB", "UTG", "UTG1", "UTG2", "UTG3", "LJ", "HJ", "CO"],
};
