import z from 'zod';
import { ReportStatus } from '../constants';

export const CreateUserReportDtoSchema = z.object({
  targetId: z.number(),
  reasonId: z.number(),
  reasonDesc: z.string(),
  evidenceImages: z.array(z.string()).optional(),
  snapshot: z.record(z.string(), z.unknown()),
});

export type CreateUserReportDto = z.infer<typeof CreateUserReportDtoSchema>;

export const CreateCommentReportDtoSchema = z.object({
  targetId: z.number(),
  reasonId: z.number(),
  reasonDesc: z.string(),
  evidenceImages: z.array(z.string()).optional(),
  snapshot: z.record(z.string(), z.unknown()),
});

export type CreateCommentReportDto = z.infer<typeof CreateCommentReportDtoSchema>;

export const CreateLostReportDtoSchema = z.object({
  targetId: z.number(),
  reasonId: z.number(),
  reasonDesc: z.string(),
  evidenceImages: z.array(z.string()).optional(),
  snapshot: z.record(z.string(), z.unknown()),
});

export type CreateLostReportDto = z.infer<typeof CreateLostReportDtoSchema>;

export const CreateFoundReportDtoSchema = z.object({
  targetId: z.number(),
  reasonId: z.number(),
  reasonDesc: z.string(),
  evidenceImages: z.array(z.string()).optional(),
  snapshot: z.record(z.string(), z.unknown()),
});

export type CreateFoundReportDto = z.infer<typeof CreateFoundReportDtoSchema>;

export const ReportVoSchema = z.object({
  id: z.number(),
  status: z.number(),
  targetType: z.number().int().min(1).max(4),
  targetId: z.number(),
  reporter: z.object({
    id: z.number(),
    name: z.string(),
  }),
  reason: z.object({
    id: z.number(),
    reasonText: z.string(),
  }),
  handlingResult: z.string(),
  createdAt: z.string(),
  snapshot: z.record(z.string(), z.unknown()),
  evidenceImages: z.array(z.string()).optional(),
});

export type ReportVo = z.infer<typeof ReportVoSchema>;

export const ReportReasonDtoSchema = z.object({
  id: z.number(),
  reasonText: z.string(),
  targetType: z.number().optional(),
  sortOrder: z.number(),
  isActive: z.number(),
});
export type ReportReasonDto = z.infer<typeof ReportReasonDtoSchema>;

export const HandleReportDtoSchema = z.object({
  status: z.enum(ReportStatus),
  handlingResult: z.string().optional(),
  punishmentType: z.coerce.number().int().optional(),
  punishmentDurationDays: z.coerce.number().int().optional(),
});
export type HandleReportDto = z.infer<typeof HandleReportDtoSchema>;

export const ReportPaginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).max(100),
  pageSize: z.coerce.number().int().min(1).max(100),
  status: z.coerce.number().int().min(0).max(2).optional(),
  targetType: z.coerce.number().int().min(1).max(4).optional(),
});
export type ReportPaginationParams = z.infer<typeof ReportPaginationParamsSchema>;
