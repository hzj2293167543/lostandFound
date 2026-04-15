import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function ImportInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>导入说明</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium">选择文件</p>
              <p className="text-sm text-gray-500">
                支持多种格式：TXT、Markdown、PDF、Word、Excel、PowerPoint
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium">选择分类</p>
              <p className="text-sm text-gray-500">
                根据文件内容选择对应的分类：常见问题、通知公告或规章制度
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium">导入处理</p>
              <p className="text-sm text-gray-500">
                系统会自动解析文件内容，生成文本块并创建向量嵌入，用于 AI 问答
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">注意事项</span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 重复内容会自动跳过</li>
            <li>• PDF 支持文本提取（扫描件除外）</li>
            <li>• Excel 文件建议每个 Sheet 一个主题</li>
            <li>• 文本块大小约 500 字符</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
