import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export default React.memo(function FoundTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>失物招领小提示</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>捡到物品后请尽快发布招领信息，帮助失主早日找回</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>详细描述物品特征和捡到地点，便于失主识别</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>保持联系方式畅通，及时查看评论和消息</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">•</span>
            <span>确认失主身份后再交付物品，避免冒领</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
});
