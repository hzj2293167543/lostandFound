import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>知识库使用指南</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">什么是知识库导入？</h3>
          <p className="text-gray-600">
            知识库导入功能允许您上传各类文档（规章制度、常见问题、通知公告等），系统会自动解析文档内容，
            将文本分割成小块，生成向量嵌入存储到数据库中。当用户使用 AI
            问答功能时，系统会从知识库中检索相关内容， 帮助 AI 提供更准确、更符合实际情况的回答。
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">三种分类的用途</h3>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">FAQ（常见问题）</p>
              <p className="text-sm text-gray-500">
                用于存放用户常见问题及解答，如失物招领流程、费用问题等
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Notice（通知公告）</p>
              <p className="text-sm text-gray-500">
                用于存放各类通知公告，如系统维护通知、活动公告等
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Rule（规章制度）</p>
              <p className="text-sm text-gray-500">
                用于存放规章制度、行为准则等需要用户了解遵守的规则
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">文件准备建议</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>文档内容尽量结构化，便于系统提取关键信息</li>
            <li>避免将不同主题的内容混合在一个文件中</li>
            <li>PDF 文件请确保是文本型而非扫描件</li>
            <li>Excel 文件每个 Sheet 应围绕一个主题</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
