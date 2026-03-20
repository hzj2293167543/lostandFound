export const CommentItemType = {
  LostItem: 0,
  FoundItem: 1,
};

export type CommentItemTypeType = (typeof CommentItemType)[keyof typeof CommentItemType];
