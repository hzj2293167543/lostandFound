import { ExtendProp } from './utils';

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

/**
 * cell grid组件 props 类型
 */
export interface CellProps<T> {
  data: {
    items: T[];
    hasNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    isFetchingNextPage?: boolean;
    isFetching?: boolean;
    isFilterChanged?: boolean;
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
    isFetching?: boolean;
    isSelf?: boolean;
  };
}

/**
 * cell list组件 props 类型 显式指定索引、样式等
 */
export interface CellRowPropsExplicit<T> extends CellRowProps<T> {
  index: number;
  style: React.CSSProperties;
}

/**
 * comment cell list组件 props 类型 评论项
 */
export type CellRowCommentProps<T> = ExtendProp<
  CellRowProps<T>,
  'data',
  {
    expandedComments: Record<number, boolean>;
    toggleComment: (commentId: number) => void;
  }
>;

/**
 * comment cell list组件 props 类型 评论项 显式指定索引、样式等
 */
export interface CellRowCommentPropsExplicit<T> extends CellRowCommentProps<T> {
  index: number;
  style: React.CSSProperties;
}
