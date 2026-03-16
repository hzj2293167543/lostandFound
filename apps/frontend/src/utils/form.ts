import { FieldErrors } from 'react-hook-form';

/**
 * 获取表单第一个错误信息
 * @param errors 错误对象
 * @returns 错误信息
 */
export const getFirstError = (errors: FieldErrors) => {
  const firstError = Object.values(errors).find(Boolean);
  if (firstError?.message) {
    return firstError.message.toString();
  }
  return '';
};

/**
 * 获取错误信息
 * @param errors 错误对象
 * @param defaultMsg 默认错误信息
 * @returns 错误信息
 */
export function getErrorMsg(errors: unknown, defaultMsg = '请求失败') {
  if (errors instanceof Error) {
    return errors.message;
  }
  return defaultMsg;
}
