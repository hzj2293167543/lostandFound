import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { reportApi } from '@/api';
import { toast } from 'sonner';
import { ReportReasonDto, TReportTargetType } from '@lostfound/shared';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: TReportTargetType;
  targetId: number;
  targetSnapshot: Record<string, any>;
}

export function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  targetSnapshot,
}: ReportDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [reasonDesc, setReasonDesc] = useState('');

  const { data: reasons = [], isLoading } = useQuery({
    queryKey: ['report-reasons', targetType],
    queryFn: () => reportApi.getReportReasons(targetType),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      reportApi.createReport({
        targetType,
        targetId,
        reasonId: selectedReasonId as number,
        reasonDesc: reasonDesc || '',
        snapshot: targetSnapshot,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('举报已提交，感谢您的反馈');
        onOpenChange(false);
        setSelectedReasonId(null);
        setReasonDesc('');
      } else {
        toast.error(res.message || '举报失败');
      }
    },
    onError: (err) => {
      toast.error(err.message || '举报失败，请稍后重试');
    },
  });

  const handleSubmit = () => {
    if (!selectedReasonId) {
      toast.error('请选择举报原因');
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>举报内容</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">举报原因 *</Label>
            {isLoading ? (
              <div className="text-sm text-gray-500">加载中...</div>
            ) : (
              <RadioGroup
                value={String(selectedReasonId)}
                onValueChange={(v: string) => setSelectedReasonId(Number(v))}>
                <div className="space-y-2">
                  {reasons.map((reason: ReportReasonDto) => (
                    <div key={reason.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(reason.id)} id={`reason-${reason.id}`} />
                      <Label htmlFor={`reason-${reason.id}`} className="text-sm cursor-pointer">
                        {reason.reasonText}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">补充说明（可选）</Label>
            <Textarea
              value={reasonDesc}
              onChange={(e) => setReasonDesc(e.target.value)}
              placeholder="请提供更多 details 信息..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || !selectedReasonId}>
            {createMutation.isPending ? '提交中...' : '提交举报'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
