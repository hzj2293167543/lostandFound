/**
 * 扩展类型 P 中的某个字段 K，将 Extra 字段合并到该字段中
 * @example
 * type Original = { a: string; b: number; data: { x: boolean } };
 * type Extended = ExtendProp<Original, 'data', { y: string }>;
 */
export type ExtendProp<P, K extends keyof P, Extra> = Omit<P, K> & {
  [k in K]: P[K] & Extra;
};
