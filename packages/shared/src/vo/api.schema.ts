import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema,
  });

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const ApiErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.null(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
    role: z.string(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const CountSchema = z.object({
  totalCount: z.number(),
  successCount: z.number().optional(),
  failedCount: z.number().optional(),
});

export type Count = z.infer<typeof CountSchema>;

export const AdminStatsSchema = z.object({
  lostCount: z.number(),
  foundCount: z.number(),
  userCount: z.number(),
  announcementCount: z.number(),
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;

export const LocationStatsSchema = z.object({
  location: z.string(),
  count: z.number(),
  type: z.enum(['lost', 'found']),
});

export type LocationStats = z.infer<typeof LocationStatsSchema>;

export const HourlyDistributionSchema = z.object({
  hour: z.number(),
  count: z.number(),
  type: z.enum(['lost', 'found']),
});

export type HourlyDistribution = z.infer<typeof HourlyDistributionSchema>;

export const WeeklyDistributionSchema = z.object({
  dayOfWeek: z.number(),
  dayName: z.string(),
  lostCount: z.number(),
  foundCount: z.number(),
});

export type WeeklyDistribution = z.infer<typeof WeeklyDistributionSchema>;

export const MonthlyDistributionSchema = z.object({
  month: z.string(),
  lostCount: z.number(),
  foundCount: z.number(),
  matchedCount: z.number(),
});

export type MonthlyDistribution = z.infer<typeof MonthlyDistributionSchema>;

export const UserActivityRankingSchema = z.object({
  userId: z.number(),
  userName: z.string(),
  postCount: z.number(),
  type: z.enum(['lost', 'found', 'comment']),
});

export type UserActivityRanking = z.infer<typeof UserActivityRankingSchema>;

export const CommentTrendSchema = z.object({
  date: z.string(),
  commentCount: z.number(),
});

export type CommentTrend = z.infer<typeof CommentTrendSchema>;

export const ReportHandlingStatsSchema = z.object({
  total: z.number(),
  pending: z.number(),
  approved: z.number(),
  rejected: z.number(),
  byType: z.record(z.string(), z.number()),
});

export type ReportHandlingStats = z.infer<typeof ReportHandlingStatsSchema>;

export const ItemFunnelSchema = z.object({
  type: z.enum(['lost', 'found']),
  stage: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export type ItemFunnel = z.infer<typeof ItemFunnelSchema>;

export const FunnelDataSchema = z.object({
  lostFunnel: z.array(ItemFunnelSchema),
  foundFunnel: z.array(ItemFunnelSchema),
});

export type FunnelData = z.infer<typeof FunnelDataSchema>;

export const WordCloudItemSchema = z.object({
  word: z.string(),
  count: z.number(),
  weight: z.number(),
});

export type WordCloudItem = z.infer<typeof WordCloudItemSchema>;

export const WordCloudDataSchema = z.object({
  lostWords: z.array(WordCloudItemSchema),
  foundWords: z.array(WordCloudItemSchema),
});

export type WordCloudData = z.infer<typeof WordCloudDataSchema>;
