import { adminApi } from '@/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminInfiniteReports } from '@/hooks/useAdminInfinite';
import { adminKeys } from '@/keys/admin';
import { ReportStatus, ReportTargetType, ReportVo, TReportStatusType } from '@lostfound/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const ITEM_HEIGHT = 320;
const PAGE_SIZE = 20;

const PUNISHMENT_TYPE_NAME: Record<number, string> = {
  1: '警告',
  2: '禁言',
  3: '封禁',
};

const STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
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

export default function AdminReports() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [handleDialogOpen, setHandleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportVo | null>(null);
  const [handlingResult, setHandlingResult] = useState('');
  const [punishmentType, setPunishmentType] = useState<number>(3);
  const [punishmentDays, setPunishmentDays] = useState<number>(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const status = statusFilter === 'all' ? undefined : (Number(statusFilter) as TReportStatusType);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useAdminInfiniteReports(PAGE_SIZE, status);

  const { data: stats } = useQuery({
    queryKey: [...adminKeys.all, 'reports-stats'],
    queryFn: () => adminApi.getReportStats(),
  });

  const handleMutation = useMutation({
    mutationFn: ({
      id,
      status,
      handlingResult,
      punishmentType,
      punishmentDays,
    }: {
      id: number;
      status: TReportStatusType;
      handlingResult?: string;
      punishmentType?: number;
      punishmentDays?: number;
    }) => adminApi.handleReport(id, status, handlingResult, punishmentType, punishmentDays),
    onSuccess: () => {
      toast.success('处理成功');
      setHandleDialogOpen(false);
      setSelectedReport(null);
      setHandlingResult('');
      setPunishmentType(3);
      setPunishmentDays(0);
      refetch();
    },
    onError: () => {
      toast.error('处理失败');
    },
  });

  const reports = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const rowVirtualizer = useVirtualizer({
    count: reports.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const renderReportRow = useCallback(
    (report: ReportVo) => (
      <Card key={report.id}>
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedReport(report);
                  setHandleDialogOpen(true);
                }}>
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
    ),
    []
  );

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isUserReport = selectedReport?.targetType === ReportTargetType.User;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">举报管理</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(option.value)}>
              {option.label}
              {option.value === String(ReportStatus.Pending) && stats?.pending ? (
                <Badge variant="destructive" className="ml-2">
                  {stats.pending}
                </Badge>
              ) : null}
            </Button>
          ))}
        </div>
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无举报记录</p>
      ) : (
        <div ref={parentRef} className="h-[650px] overflow-auto" onScroll={handleScroll}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const report = reports[virtualItem.index];
              if (!report) return null;
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                    padding: '0 0 16px 0',
                  }}>
                  {renderReportRow(report)}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <Dialog open={handleDialogOpen} onOpenChange={setHandleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>处理举报</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>被举报类型:</strong>{' '}
                {selectedReport && TARGET_TYPE_NAME[selectedReport.targetType]}
              </p>
              <p>
                <strong>被举报对象ID:</strong> {selectedReport?.targetId}
              </p>
              <p>
                <strong>举报原因:</strong> {selectedReport?.reason?.reasonText || '未说明'}
              </p>
              {selectedReport?.snapshot && (
                <p>
                  <strong>快照:</strong> {JSON.stringify(selectedReport.snapshot)}
                </p>
              )}
            </div>

            {isUserReport && (
              <div className="space-y-3 border-t pt-3">
                <Label>处罚类型</Label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={punishmentType === type ? 'default' : 'outline'}
                      onClick={() => setPunishmentType(type)}>
                      {PUNISHMENT_TYPE_NAME[type]}
                    </Button>
                  ))}
                </div>

                {punishmentType !== 1 && (
                  <div className="flex items-center gap-2">
                    <Label>处罚天数（0表示永久）</Label>
                    <Input
                      type="number"
                      min={0}
                      value={punishmentDays}
                      onChange={(e) => setPunishmentDays(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">天</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>处理结果说明（可选）</Label>
              <Textarea
                value={handlingResult}
                onChange={(e) => setHandlingResult(e.target.value)}
                placeholder="请输入处理结果..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setHandleDialogOpen(false);
                setSelectedReport(null);
              }}>
              取消
            </Button>
            <Button
              onClick={() => {
                if (selectedReport) {
                  handleMutation.mutate({
                    id: selectedReport.id,
                    status: ReportStatus.Rejected,
                    handlingResult,
                  });
                }
              }}
              disabled={handleMutation.isPending}>
              驳回
            </Button>
            <Button
              onClick={() => {
                if (selectedReport) {
                  handleMutation.mutate({
                    id: selectedReport.id,
                    status: ReportStatus.Approved,
                    handlingResult,
                    punishmentType: punishmentType,
                    punishmentDays: punishmentDays,
                  });
                }
              }}
              disabled={handleMutation.isPending}>
              通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
