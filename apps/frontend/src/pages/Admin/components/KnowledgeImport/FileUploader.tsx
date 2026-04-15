import { Button } from '@/components/ui/button';
import { KNOWLEDGE_IMPORT_CONFIG, KnowledgeImportConfigSchema } from '@lostfound/shared';
import { ChangeEvent, useState, DragEvent, useRef } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  isUploading: boolean;
}

export default function FileUploader({
  selectedFile,
  onFileSelect,
  onClear,
  isUploading,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const fileValidation = KnowledgeImportConfigSchema.safeParse({
      validExtensions: KNOWLEDGE_IMPORT_CONFIG.validExtensions,
      maxSize: file.size,
      mimeTypes: [],
    });

    if (!fileValidation.success) {
      const issues = fileValidation.error.issues.map((i) => i.message).join(', ');
      toast.error(issues || '文件验证失败');
      return false;
    }

    if (!KNOWLEDGE_IMPORT_CONFIG.validExtensions.includes(extension)) {
      toast.error(
        `不支持的文件格式，请上传 ${KNOWLEDGE_IMPORT_CONFIG.validExtensions.join(', ')} 文件`
      );
      return false;
    }
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}>
      <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {selectedFile ? (
        <div className="space-y-2">
          <p className="font-medium">{selectedFile.name}</p>
          <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <Button variant="outline" size="sm" onClick={onClear} disabled={isUploading}>
            移除
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">拖拽文件到此处，或点击下方按钮选择</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={KNOWLEDGE_IMPORT_CONFIG.validExtensions.join(',')}
            onChange={handleFileChange}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            选择文件
          </Button>
        </div>
      )}
    </div>
  );
}
