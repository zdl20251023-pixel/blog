// 实现一个快速排序的函数
export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)]!;
  const left = arr.filter((item) => item < pivot);
  const right = arr.filter((item) => item > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}