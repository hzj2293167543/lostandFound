import { FoundUpdateDto } from '@lostfound/shared';
import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import z, { ZodError, ZodSchema, ZodType } from 'zod';

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
 * 获取错误信息(支持ZodError , Error , Response)
 * @param errors 错误对象
 * @param defaultMsg 默认错误信息
 * @returns 错误信息
 */
export function getErrorMsg(errors: unknown, defaultMsg = '请求失败') {
  if (errors instanceof Error) {
    return errors.message;
  } else if (errors instanceof Response) {
    return errors.statusText || defaultMsg;
  } else if (errors instanceof ZodError) {
    return errors.issues.map((e) => e.message).join('\n');
  }
  return defaultMsg;
}

/**
 * 将对象转换为FormData
 * @param obj 要转换的对象
 * @param includeKeys 要包含的键名数组(可选)
 * @returns FormData对象
 */
export function mapObjToFormData(obj: Record<string, unknown>, includeKeys?: string[]) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (includeKeys && !includeKeys.includes(key)) return;
    // ✅ 判断是否为二进制类型（File/Blob等）
    formData.append(key, value instanceof Blob ? value : String(value));
  });
  return formData;
}

/**
 * 从FormData中提取指定字段并转换为指定类型
 * @param formData FormData对象
 * @param fields 要提取的字段数组
 * @param transforms 字段转换函数对象(可选)
 * @returns 转换后的对象
 */
export function fromFormData<T>(
  formData: FormData,
  fields: (keyof T)[],
  transforms: Partial<Record<keyof T, (v: FormDataEntryValue | null) => any>> = {}
): T {
  return fields.reduce((obj, key) => {
    const raw = formData.get(key as string);
    obj[key] = transforms[key] ? transforms[key]!(raw) : raw;
    return obj;
  }, {} as T);
}

// 类型守卫：判断一个未知对象是否为 Zod schema
function isZodSchema(schema: unknown): schema is z.ZodTypeAny {
  // 检查 schema 存在且为对象，并且拥有 safeParse 方法
  return (
    typeof schema === 'object' &&
    schema !== null &&
    'safeParse' in schema &&
    typeof schema.safeParse === 'function'
  );
}

/**
 * 安全解析 Zod  schema 数据, 由于zod类型太复杂, 所以是鸭子类型判断，类型安全较为孱弱
 * @param schema Zod schema
 * @param data 要解析的数据
 * @returns 解析后的数据
 */
export function safeParse<T>(schema: unknown, data: unknown): T {
  // 返回值类型可以根据需要调整，这里先用 unknown, zod类型太复杂ts无法处理
  if (!isZodSchema(schema)) {
    throw new Error('Invalid Zod schema');
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues.map((e) => e.message).join('\n'));
  }
  return result.data as T;
}

/**
 * 判断表单是否有脏值,由于isDirty不准确第一次输入有延迟, 所以使用dirtyFields判断
 * @param form 表单实例
 * @returns 是否有脏值
 */
export function isFormDirty<T extends FieldValues>(form: UseFormReturn<T>) {
  return Object.keys(form.formState.dirtyFields).length > 0;
}
