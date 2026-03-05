export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 声明一个辅助类型，让使用方直接获得 data 的类型
export type UnwrappedResponse<T> = T extends ApiResponse<infer D> ? D : never;
