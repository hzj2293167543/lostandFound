export const ItemTypeMap = {
  LOST: 0,
  FOUND: 1,
} as const;

export type ItemType = (typeof ItemTypeMap)[keyof typeof ItemTypeMap];
