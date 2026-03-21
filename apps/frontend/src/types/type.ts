export const ItemTypeMap = {
  LOST: 0,
  FOUND: 1,
} as const;

export type ItemType = (typeof ItemTypeMap)[keyof typeof ItemTypeMap];

export interface ActionResult<T> {
  success: boolean;
  error?: string;
  intent?: T;
}

// 布局常量 虚拟列表相关
export const MD = 768;
export const LG = 1024;
export const COLUMN_COUNT = 3; // 最大列数（lg 屏）
export const ITEM_HEIGHT = 430; // 每行高度（px）
export const LOAD_MORE_THRESHOLD = 300; // 滚动到底部提前加载的阈值（px）
export const DEFAULT_HEIGHT = 600; // 默认高度（px）
export const DEFAULT_WIDTH = 1450; // 默认宽度（px）

/**
 * cell grid组件 props 类型
 */
export interface CellProps<T> {
  data: {
    items: T[];
    hasNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    isFetchingNextPage: boolean;
  };
}

/**
 * cell grid组件 props 类型 显式指定列索引、行索引、样式等
 */
export interface CellPropsExplicit<T> extends CellProps<T> {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}

/**
 * cell list组件 props 类型
 * @template T - 数据项
 * @param data - 数据项数组
 */
export interface CellRowProps<T> {
  data: {
    items: T[];
    hasNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    isFetchingNextPage: boolean;
  };
}

/**
 * cell list组件 props 类型 显式指定索引、样式等
 */
export interface CellRowPropsExplicit<T> extends CellRowProps<T> {
  index: number;
  style: React.CSSProperties;
}
