/**
 * 检查值是否为字符串
 * @param value 要检查的值
 * @returns 如果值是字符串则返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 检查值是否为 undefined
 * @param value 要检查的值
 * @returns 如果值是 undefined 则返回 true，否则返回 false
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * 检查值是否为 null
 * @param value 要检查的值
 * @returns 如果值是 null 则返回 true，否则返回 false
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * 检查值是否为空 undefined or null
 * @param value 要检查的值
 * @returns 如果值为空则返回 true，否则返回 false
 */
export function isEmpty(value: unknown): value is string {
  return isUndefined(value) || isNull(value);
}
