export const CommentItemType = {
  LostItem: 0,
  FoundItem: 1,
};

export type CommentItemTypeType = (typeof CommentItemType)[keyof typeof CommentItemType];

export const UserStatus = {
  Normal: 1,
  Banned: 0,
};

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
