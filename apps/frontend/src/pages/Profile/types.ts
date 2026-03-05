export interface LostFoundCounts {
  lostCount: number;
  foundCount: number;
  foundSuccessCount: number;
  LostSuccessCount: number;
}

export const FOUND_STATUS = {
  招领中: 0,
  已归还: 1,
  已撤销: 2,
};

export const FOUND_STATUS_NAME = ['招领中', '已归还', '已撤销'];
