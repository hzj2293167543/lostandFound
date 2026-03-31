import { adminApi } from '@/api';
import { Button } from '@/components/ui/button';
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
import {
  PUNISHMENT_TYPE,
  PUNISHMENT_TYPE_NAME,
  ReportStatus,
  ReportTargetType,
  ReportVo,
  TPunishmentType,
  TReportStatusType,
  TReportTargetType,
} from '@lostfound/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const TARGET_TYPE_NAME: Record<number, string> = {
  [ReportTargetType.LostItem]: '失物信息',
  [ReportTargetType.FoundItem]: '招领信息',
  [ReportTargetType.User]: '用户',
  [ReportTargetType.Comment]: '评论',
};

interface HandleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReport: ReportVo | null;
  onSuccess: () => void;
}

export function HandleReportDialog({
  open,
  onOpenChange,
  selectedReport,
  onSuccess,
}: HandleReportDialogProps) {
  const [handlingResult, setHandlingResult] = useState('');
  const [punishmentType, setPunishmentType] = useState<TPunishmentType>(PUNISHMENT_TYPE.Ban);
  const [punishmentDays, setPunishmentDays] = useState<number>(0);

  const isUserReport = selectedReport?.targetType === ReportTargetType.User;
  const showPunishmentOptions =
    isUserReport ||
    selectedReport?.targetType === ReportTargetType.Comment ||
    selectedReport?.targetType === ReportTargetType.LostItem ||
    selectedReport?.targetType === ReportTargetType.FoundItem;

  const handleClose = () => {
    onOpenChange(false);
    setHandlingResult('');
    setPunishmentType(PUNISHMENT_TYPE.Ban);
    setPunishmentDays(0);
  };

  const handleMutate = useMutation({
    mutationFn: async (status: TReportStatusType) => {
      if (!selectedReport) return;

      const dto = {
        status,
        handlingResult,
        punishmentType,
        punishmentDurationDays: punishmentDays,
      };
      switch (selectedReport.targetType as TReportTargetType) {
        case ReportTargetType.User:
          await adminApi.handleUserReport(selectedReport.id, dto);
          break;
        case ReportTargetType.Comment:
          await adminApi.handleCommentReport(selectedReport.id, dto);
          break;
        case ReportTargetType.LostItem:
          await adminApi.handleLostReport(selectedReport.id, dto);
          break;
        case ReportTargetType.FoundItem:
          await adminApi.handleFoundReport(selectedReport.id, dto);
          break;
      }
    },
    onSuccess: () => {
      toast.success('处理成功');
      handleClose();
      setHandlingResult('');
      setPunishmentType(3);
      setPunishmentDays(0);
      onSuccess();
    },
    onError: () => {
      toast.error('处理失败');
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            {!isUserReport && (
              <p className="text-orange-500 text-sm mt-2">
                注意：批准此举报将自动删除对应的
                {selectedReport && TARGET_TYPE_NAME[selectedReport.targetType]}
              </p>
            )}
          </div>

          <h3 className="text-lg font-bold mt-4">对被举报用户处理</h3>
          {showPunishmentOptions && (
            <div className="space-y-3 border-t pt-3">
              <Label>处罚类型</Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={punishmentType === type ? 'default' : 'outline'}
                    onClick={() => setPunishmentType(type as TPunishmentType)}>
                    {PUNISHMENT_TYPE_NAME[type as TPunishmentType]}
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
              className="resize-none mt-2"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={handleMutate.isPending}>
            取消
          </Button>
          <Button
            onClick={() => handleMutate.mutate(ReportStatus.Rejected)}
            disabled={handleMutate.isPending}>
            驳回
          </Button>
          <Button
            onClick={() => handleMutate.mutate(ReportStatus.Approved)}
            disabled={handleMutate.isPending}>
            通过
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
