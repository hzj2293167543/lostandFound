export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  recentLost: () => [...adminKeys.all, 'recent-lost'] as const,
  recentFound: () => [...adminKeys.all, 'recent-found'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  lost: () => [...adminKeys.all, 'lost'] as const,
  found: () => [...adminKeys.all, 'found'] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
  announcements: () => [...adminKeys.all, 'announcements'] as const,
};
