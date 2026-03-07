export interface FilterState {
  status: number;
  searchTerm: string;
  category: number;
}

export type SetFilterState = (
  key: keyof FilterState,
  value: FilterState[keyof FilterState]
) => void;

/**
 * 全部类别筛选
 */
export const ALL_CATEGORY = -1;

/**
 * 招领状态筛选
 */
export const LOST_FILTER_STATUS = {
  全部状态: -1,
  寻找中: 0,
  已找到: 1,
  已撤销: 2,
};

export const LOST_FILTER_STATUS_TO_NAME = ['全部状态', '寻找中', '已找到', '已撤销'];
