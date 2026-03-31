import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportStatus, ReportTargetType, ReportVo } from '@lostfound/shared';

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: String(ReportStatus.Pending), label: '待处理' },
  { value: String(ReportStatus.Approved), label: '已通过' },
  { value: String(ReportStatus.Rejected), label: '已驳回' },
];

const TARGET_TYPE_NAME: Record<number, string> = {
  [ReportTargetType.LostItem]: '失物信息',
  [ReportTargetType.FoundItem]: '招领信息',
  [ReportTargetType.User]: '用户',
  [ReportTargetType.Comment]: '评论',
};

interface ReportCardProps {
  report: ReportVo;
  onHandle: (report: ReportVo) => void;
}

export function ReportCard({ report, onHandle }: ReportCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">
            举报ID: {report.id}
            <Badge
              variant={
                report.status === ReportStatus.Pending
                  ? 'destructive'
                  : report.status === ReportStatus.Approved
                    ? 'default'
                    : 'secondary'
              }
              className="ml-2">
              {STATUS_OPTIONS.find((o) => o.value === String(report.status))?.label}
            </Badge>
          </CardTitle>
          {report.status === ReportStatus.Pending && (
            <Button size="sm" variant="outline" onClick={() => onHandle(report)}>
              处理
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 space-y-1">
          <p>被举报类型: {TARGET_TYPE_NAME[report.targetType] || '未知'}</p>
          <p>被举报对象ID: {report.targetId}</p>
          <p>举报人: {report.reporter?.name || '未知'}</p>
          <p>举报原因: {report.reason?.reasonText || '未说明'}</p>
          {report.handlingResult && <p>处理结果: {report.handlingResult}</p>}
          <p className="text-xs text-gray-400">
            举报时间: {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
