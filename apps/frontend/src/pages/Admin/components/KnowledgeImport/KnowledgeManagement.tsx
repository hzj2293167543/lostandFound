import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminApi } from '@/api';
import { adminKeys } from '@/queryKeys/admin.key';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatDateKnowledge, getTypeLabel } from '@/utils';

interface DocumentInfo {
  sourceFile: string;
  type: string;
  chunkCount: number;
  uploadedAt: string;
  preview: string;
}

export default function KnowledgeManagement() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<DocumentInfo | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: adminKeys.knowledgeDocuments(),
    queryFn: () => adminApi.getKnowledgeDocuments(),
  });

  const deleteMutation = useMutation({
    mutationFn: (sourceFile: string) => adminApi.deleteKnowledgeDocument(sourceFile),
    onSuccess: (result) => {
      toast.success(`已删除 ${result?.deleted || 0} 个 chunk`);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: adminKeys.knowledgeDocuments() });
    },
    onError: () => {
      toast.error('删除失败，请重试');
    },
  });

  const filteredData = data?.filter((doc) => filterType === 'all' || doc.type === filterType) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">加载失败，请刷新页面重试</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">知识库管理</h1>
      </div>

      <Tabs value={filterType} onValueChange={setFilterType}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="faq">常见问题</TabsTrigger>
          <TabsTrigger value="notice">通知公告</TabsTrigger>
          <TabsTrigger value="rule">规章制度</TabsTrigger>
        </TabsList>

        <TabsContent value={filterType}>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无知识库文档</p>
              <p className="text-sm mt-1">请先在「知识库导入」页面上传文档</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead className="w-24 text-center">Chunk数</TableHead>
                    <TableHead className="w-40">上传时间</TableHead>
                    <TableHead>内容预览</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((doc) => (
                    <TableRow key={`${doc.sourceFile}-${doc.type}`}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {doc.sourceFile}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            doc.type === 'faq'
                              ? 'bg-blue-100 text-blue-700'
                              : doc.type === 'notice'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                          }`}>
                          {getTypeLabel(doc.type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{doc.chunkCount}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDateKnowledge(doc.uploadedAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-[300px] truncate">
                        {doc.preview || '无预览'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(doc)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除文档「{deleteTarget?.sourceFile}」吗？这将删除全部{' '}
              {deleteTarget?.chunkCount} 个 chunk，此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.sourceFile)}
              disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
