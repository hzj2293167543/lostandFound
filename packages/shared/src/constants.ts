export const LostItemStatus = {
  寻找中: 0,
  已找到: 1,
  已撤销: 2,
} as const;

export const FoundItemStatus = {
  招领中: 0,
  已归还: 1,
  已撤销: 2,
} as const;

export const FOUND_STATUS_NAME = ['招领中', '已归还', '已撤销'] as const;

export const LOST_STATUS_NAME = ['寻找中', '已找到', '已撤销'] as const;

export const ReportTargetType = {
  LostItem: 1,
  FoundItem: 2,
  User: 3,
  Comment: 4,
} as const;

export type TReportTargetType = (typeof ReportTargetType)[keyof typeof ReportTargetType];

export const ReportStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export type TReportStatusType = (typeof ReportStatus)[keyof typeof ReportStatus];

export const PUNISHMENT_TYPE = {
  Warning: 1,
  Mute: 2,
  Ban: 3,
} as const;

export type TPunishmentType = (typeof PUNISHMENT_TYPE)[keyof typeof PUNISHMENT_TYPE];

export const PUNISHMENT_TYPE_NAME = {
  [PUNISHMENT_TYPE.Warning]: '警告',
  [PUNISHMENT_TYPE.Mute]: '禁言',
  [PUNISHMENT_TYPE.Ban]: '封禁',
} as const;
