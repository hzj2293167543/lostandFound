import z from 'zod';
import { ReportTargetType } from '../constants';
import { snapshot } from 'node:test';

export const CreateReportDtoSchema = z.object({
  targetType: z.enum(ReportTargetType),
  targetId: z.number(),
  reasonId: z.number(),
  reasonDesc: z.string(),
  evidenceImages: z.array(z.string()).optional(),
  snapshot: z.record(z.string(), z.unknown()),
});

export type CreateReportDto = z.infer<typeof CreateReportDtoSchema>;

export const ReportVoSchema = z.object({
  id: z.number(),
  status: z.number(),
  targetType: z.number(),
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
