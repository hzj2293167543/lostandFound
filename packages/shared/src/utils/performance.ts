/**
 * 防抖函数(不断重置定时器，超过时间间隔执行一次)
 * @param func 函数
 * @param delay 间隔时间
 * @template T 函数类型
 * @returns
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数(固定时间间隔)每次执行计算一次，超过时间间隔不执行
 * @param func 函数
 * @param delay 间隔时间
 * @template T 函数类型
 * @returns
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime: number = 0;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime < delay) return;
    lastTime = now;
    func.apply(this, args);
  };
}
