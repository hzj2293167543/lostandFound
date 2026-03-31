import {
  CreateUserReportDto,
  CreateCommentReportDto,
  CreateLostReportDto,
  CreateFoundReportDto,
  ReportReasonDto,
  TReportTargetType,
} from '@lostfound/shared';
import { post, get } from '../client';

export const reportApi = {
  createUserReport: (data: CreateUserReportDto) =>
    post<{ success: boolean; message: string; data?: unknown }>('/reports/user', data),

  createCommentReport: (data: CreateCommentReportDto) =>
    post<{ success: boolean; message: string; data?: unknown }>('/reports/comment', data),

  createLostReport: (data: CreateLostReportDto) =>
    post<{ success: boolean; message: string; data?: unknown }>('/reports/lost', data),

  createFoundReport: (data: CreateFoundReportDto) =>
    post<{ success: boolean; message: string; data?: unknown }>('/reports/found', data),

  getReportReasons: (targetType?: TReportTargetType) =>
    get<ReportReasonDto[]>(`/reports/reasons${targetType ? `?targetType=${targetType}` : ''}`),
};

export default reportApi;
