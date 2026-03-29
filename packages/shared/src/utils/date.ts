import { isValidDate } from './typeGuard';

/**
 * 计算两个日期的毫秒差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的毫秒数
 */
export function diffMs(later: Date, earlier: Date): number {
  return later.getTime() - earlier.getTime();
}

/**
 * 计算两个日期的秒差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的秒数
 */
export function diffSec(later: Date, earlier: Date): number {
  return diffMs(later, earlier) / 1000;
}

/**
 * 计算两个日期的分钟差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的分钟数
 */
export function diffMin(later: Date, earlier: Date): number {
  if (!isValidDate(later) || !isValidDate(earlier)) {
    throw new Error('Invalid date arguments');
  }
  return diffSec(later, earlier) / 60;
}

/**
 * 计算两个日期的小时差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的小时数
 */
export function diffHour(later: Date, earlier: Date): number {
  return diffMin(later, earlier) / 60;
}

/**
 * 计算两个日期的天差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的天数
 */
export function diffDay(later: Date, earlier: Date): number {
  return diffHour(later, earlier) / 24;
}

/**
 * 计算两个日期的周差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的周数
 */
export function diffWeek(later: Date, earlier: Date): number {
  return diffDay(later, earlier) / 7;
}

/**
 * 计算两个日期的月差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的月数
 */
export function diffMonth(later: Date, earlier: Date): number {
  return diffDay(later, earlier) / 30;
}

/**
 * 计算两个日期的年差（带符号）
 * @param later 较晚的日期
 * @param earlier 较早的日期
 * @returns later - earlier 的年数
 */
export function diffYear(later: Date, earlier: Date): number {
  return diffMonth(later, earlier) / 12;
}
