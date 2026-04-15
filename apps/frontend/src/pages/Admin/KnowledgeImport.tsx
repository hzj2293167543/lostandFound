import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminApi } from '@/api';
import { type TKnowledgeType, KnowledgeType } from '@lostfound/shared';
import { useMutation } from '@tanstack/react-query';
import { FileUp, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  FileUploader,
  HelpTab,
  ImportInstructions,
  ImportResultDialog,
  KnowledgeManagement,
  TypeSelector,
} from './components/KnowledgeImport';
import { queryClient } from '@/lib/queryClient';
import { adminKeys } from '@/queryKeys/admin.key';

interface ImportResult {
  totalChunks: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function KnowledgeImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<TKnowledgeType>(KnowledgeType.FAQ);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const importMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: TKnowledgeType }) =>
      adminApi.importKnowledge(file, type),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.knowledgeDocuments() });
      setImportResult(result);
      setShowResultDialog(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: () => {
      toast.error('导入失败，请重试');
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setImportResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error('请先选择文件');
      return;
    }
    importMutation.mutate({ file: selectedFile, type: selectedType });
  };

  const isUploading = importMutation.isPending;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">知识库导入</h1>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="import">文件导入</TabsTrigger>
          <TabsTrigger value="management">文档管理</TabsTrigger>
          <TabsTrigger value="help">使用说明</TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>上传文件</CardTitle>
                <CardDescription>
                  支持 txt, md, pdf, docx, xlsx, xls, pptx 格式，单文件不超过 50MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploader
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onClear={handleClear}
                  isUploading={isUploading}
                />

                <TypeSelector value={selectedType} onChange={setSelectedType} />

                <Button
                  className="w-full"
                  disabled={!selectedFile || isUploading}
                  onClick={handleImport}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      导入中...
                    </>
                  ) : (
                    <>
                      <FileUp className="w-4 h-4 mr-2" />
                      开始导入
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <ImportInstructions />
          </div>
        </TabsContent>

        <TabsContent value="management">
          <KnowledgeManagement />
        </TabsContent>

        <TabsContent value="help">
          <HelpTab />
        </TabsContent>
      </Tabs>

      <ImportResultDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        result={importResult}
      />
    </div>
  );
}
