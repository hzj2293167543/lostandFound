import { CreateReportDto, ReportReasonDto, TReportTargetType } from '@lostfound/shared';
import { post, get } from '../client';

export const reportApi = {
  createReport: (data: CreateReportDto) =>
    post<{ success: boolean; message: string; data?: any }>('/reports', data),

  getReportReasons: (targetType?: TReportTargetType) =>
    get<ReportReasonDto[]>(`/reports/reasons${targetType ? `?targetType=${targetType}` : ''}`),
};

export default reportApi;
