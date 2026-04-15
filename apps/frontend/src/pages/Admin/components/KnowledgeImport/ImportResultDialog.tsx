import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImportResult } from '@lostfound/shared';
import { AlertCircle, CheckCircle, FileText, XCircle } from 'lucide-react';

interface ImportResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ImportResult | null;
}

export default function ImportResultDialog({
  open,
  onOpenChange,
  result,
}: ImportResultDialogProps) {
  if (!result) return null;
  console.log(result);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入完成</DialogTitle>
          <DialogDescription>文件已成功处理，以下是导入结果</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-2xl font-bold text-green-600">{result.imported}</span>
              <span className="text-sm text-green-600">导入成功</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-8 h-8 text-yellow-600 mb-2" />
              <span className="text-2xl font-bold text-yellow-600">{result.skipped}</span>
              <span className="text-sm text-yellow-600">跳过(重复)</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-2xl font-bold text-red-600">{result.errors?.length}</span>
              <span className="text-sm text-red-600">失败</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="w-5 h-5" />
              <span className="font-medium">总计 {result.totalChunks} 个文本块</span>
            </div>
          </div>

          {result.errors?.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">错误详情</span>
              </div>
              <ul className="text-sm text-red-600 space-y-1">
                {result.errors.map((error) => (
                  <li key={error.toString()}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
