export const commentKeys = {
  all: ['comments'] as const,
  detail: (id: number) => [...commentKeys.all, 'detail', id] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: <T extends Record<string, unknown>>(userId: number, filters?: T) =>
    [...commentKeys.lists(), userId, filters] as const,
  userCommentList: (userId: number) => [...commentKeys.all, 'user', userId] as const,
  itemComments: (itemId: number, itemType: number) =>
    [...commentKeys.all, 'item', itemId, itemType] as const,
};
