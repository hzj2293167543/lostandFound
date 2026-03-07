import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { memo } from 'react';
import { LostFoundCounts } from '../types';

export default memo(function LostFoundList({ counts }: { counts: LostFoundCounts }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>账户统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">发布失物信息</span>
            <span className="font-semibold">{counts.lostCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">发布招领信息</span>
            <span className="font-semibold">{counts.foundCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">已找到物品</span>
            <span className="font-semibold">{counts.foundSuccessCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">帮助他人找回</span>
            <span className="font-semibold">{counts.lostSuccessCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
