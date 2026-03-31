import { TReportStatusType } from '@lostfound/shared';

import { TReportTargetType } from '@lostfound/shared';

export interface ReportPaginationParams {
  page: number;
  pageSize: number;
  status?: TReportStatusType;
  targetType?: TReportTargetType;
}
