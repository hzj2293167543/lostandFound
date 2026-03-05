import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { LOST_FILTER_STATUS } from '@/pages/Lost/type';
import { LostItem } from '@/types';
import { memo } from 'react';
import LostEdit from './LostEdit';
import { Link } from 'react-router-dom';

export default memo(function PersonalInfoDetailLostList({ lostItems }: { lostItems: LostItem[] }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">我的失物信息</h2>
      <div className="space-y-6">
        {lostItems.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-gray-600 text-center py-12">暂无失物记录</p>
            </CardContent>
          </Card>
        ) : (
          lostItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  分类：{item.category.name} | 发布时间：{item.time}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${item.status.code === LOST_FILTER_STATUS.寻找中 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {item.status.name}
                </span>
                <Link to={`/lost/${item.id}`} className="ml-auto mr-2">
                  <Button variant="outline">查看详情</Button>
                </Link>
                <LostEdit lostItemId={item.id} />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
});
