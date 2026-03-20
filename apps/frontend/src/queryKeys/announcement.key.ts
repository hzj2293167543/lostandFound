export const announcementKeys = {
  list: () => ['announcement'],
  listTop3: () => [...announcementKeys.list(), 'top3'],
  detail: (id: number) => [...announcementKeys.list(), id],
};
