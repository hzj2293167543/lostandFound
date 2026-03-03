import { FoundItem, Category } from '@/types';

/** 查找物品筛选状态
 * 0: 招领中
 * 1: 已归还
 * 2: 已撤销
 * -1: 全部
 */
export interface FilterState {
  status: number;
  searchTerm: string;
  category: number;
}

export interface SetFilterState {
  (key: FilterStateKey, value: FilterState[FilterStateKey]): void;
}
export interface FoundLoaderData {
  foundItems: FoundItem[];
  categories: Category[];
}

export type FilterStateKey = keyof FilterState;
/**
 * 全部类别筛选
 */
export const ALL_CATEGORY = -1;

/**
 * 全部状态筛选
 */
export const FOUND_FILTER_STATUS = {
  全部状态: -1,
  招领中: 0,
  已归还: 1,
  已撤销: 2,
};
