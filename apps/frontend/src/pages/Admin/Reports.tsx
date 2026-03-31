import { adminApi } from '@/api';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminInfiniteReports } from '@/hooks/useAdminInfinite';
import { adminKeys } from '@/keys/admin';
import { ReportStatus, ReportTargetType, ReportVo, TReportStatusType } from '@lostfound/shared';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { HandleReportDialog } from './components/HandleReportDialog';
import { ReportCard } from './components/ReportCard';
const ITEM_HEIGHT = 250;
const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: String(ReportStatus.Pending), label: '待处理' },
  { value: String(ReportStatus.Approved), label: '已通过' },
  { value: String(ReportStatus.Rejected), label: '已驳回' },
];

const TARGET_TYPE_OPTIONS = [
  { value: 'all', label: '全部类型' },
  { value: String(ReportTargetType.LostItem), label: '失物信息' },
  { value: String(ReportTargetType.FoundItem), label: '招领信息' },
  { value: String(ReportTargetType.User), label: '用户' },
  { value: String(ReportTargetType.Comment), label: '评论' },
];

export default function AdminReports() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');
  const [handleDialogOpen, setHandleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportVo | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const status = statusFilter === 'all' ? undefined : (Number(statusFilter) as TReportStatusType);
  const targetType =
    targetTypeFilter === 'all'
      ? undefined
      : (Number(targetTypeFilter) as (typeof ReportTargetType)[keyof typeof ReportTargetType]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useAdminInfiniteReports(PAGE_SIZE, status, targetType);

  const { data: stats } = useQuery({
    queryKey: [...adminKeys.all, 'reports-stats'],
    queryFn: () => adminApi.getReportStats(),
  });

  const reports = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: reports.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    measureElement: (el) => {
      const style = getComputedStyle(el);
      const height = el.getBoundingClientRect().height;
      const marginBottom = parseFloat(style.marginBottom);
      return height + marginBottom;
    },
    overscan: 5,
  });

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /**
   * 处理举报成功
   */
  const onSuccess = () => {
    setSelectedReport(null);
    refetch();
  };
  /**
   * 处理举报
   */
  const handleReport = (report: ReportVo) => {
    setSelectedReport(report);
    setHandleDialogOpen(true);
  };

  const renderReportCard = useCallback((report: ReportVo) => {
    return <ReportCard key={report.id} report={report} onHandle={handleReport} />;
  }, []);

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
        <div className="flex items-center gap-2">
          <Label>状态：</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {option.value === String(ReportStatus.Pending) && stats?.pending ? (
                    <span className="ml-2 text-red-500">({stats.pending})</span>
                  ) : null}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>类型：</Label>
          <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TARGET_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                    padding: '0 0 16px 0',
                  }}>
                  {renderReportCard(report)}
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
      <HandleReportDialog
        open={handleDialogOpen}
        onOpenChange={setHandleDialogOpen}
        selectedReport={selectedReport}
        onSuccess={onSuccess}
      />
    </div>
  );
}
