// 写一个快速排序的测试用例
import { describe, it, expect } from "bun:test";
import { quickSort } from "../../src/utils/quickSort";

// 用的内置的describe、it、expect
// 终端运行：bun test .\testQuickSort.ts
describe("quickSort", () => {
  it("should sort an array", () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 7, 8, 0];
    const sorted = quickSort(arr);
    // expect(sorted).toEqual([0, 1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9]);
    console.log(sorted);
  });
});