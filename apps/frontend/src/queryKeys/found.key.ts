export const foundKeys = {
  all: ['found-items'] as const,
  detail: (id: number) => [...foundKeys.all, 'detail', id] as const,
  lists: () => [...foundKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(userId: number, filters?: T) =>
    [...foundKeys.lists(), userId, filters] as const,
  listTop3: () => [...foundKeys.lists(), 'top3'] as const,
  infinite: (filters?: Record<string, unknown>) =>
    [...foundKeys.lists(), 'infinite', filters] as const,
};
