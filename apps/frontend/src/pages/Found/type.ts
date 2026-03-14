export interface FilterState {
  status: number;
  searchTerm: string;
  category: number;
}

export type SetFilterState = (
  key: keyof FilterState,
  value: FilterState[keyof FilterState]
) => void;

export const ALL_CATEGORY = -1;

export const FOUND_FILTER_STATUS = {
  全部状态: -1,
  招领中: 0,
  已认领: 1,
  已撤销: 2,
};

export const FOUND_FILTER_STATUS_TO_NAME = ['全部状态', '招领中', '已认领', '已撤销'];

export const FOUND_DETAIL_INTENT = {
  COMMENT: 0,
  THUMBS_UP: 1,
};
