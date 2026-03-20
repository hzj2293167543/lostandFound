export const lostKeys = {
  all: ['lost'] as const,
  detail: (id: number) => [...lostKeys.all, 'detail', id] as const,
  lists: () => [...lostKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(userId: number, filters?: T) =>
    [...lostKeys.lists(), userId, filters] as const,
  listTop3: () => [...lostKeys.lists(), 'top3'] as const,
};
