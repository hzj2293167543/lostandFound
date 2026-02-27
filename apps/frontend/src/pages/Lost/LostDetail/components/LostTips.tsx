import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';

export default React.memo(function LostTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>失物招领小提示</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>丢失物品后请尽快发布失物信息，提高找回几率</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>详细描述物品特征和丢失地点，便于他人识别</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>保持联系方式畅通，及时查看评论和消息</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>物品找回后请及时更新状态，避免他人重复联系</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
});
