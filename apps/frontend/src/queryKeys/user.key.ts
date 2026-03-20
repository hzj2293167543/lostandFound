export const userKeys = {
  all: ['users'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(filters?: T) => [...userKeys.lists(), filters] as const,
};
