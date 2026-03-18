import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FOUND_FILTER_STATUS } from '@/pages/Found/type';
import { FoundItem } from '@lostfound/shared';
import { memo } from 'react';
import { Link } from 'react-router';
import { FOUND_STATUS_NAME } from '../types';
import FoundEdit from './FoundEdit';

export default memo(function PersonalInfoDetailFoundList({
  foundItems,
  isSelf,
}: {
  foundItems: FoundItem[];
  isSelf: boolean;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">我的招领信息</h2>
      <div className="space-y-6">
        {foundItems.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-gray-600 text-center py-12">暂无招领记录</p>
            </CardContent>
          </Card>
        ) : (
          foundItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  分类：{item.category.name} | 发布时间：{item.time}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${item.status === FOUND_FILTER_STATUS.招领中 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {FOUND_STATUS_NAME[item.status]}
                </span>
                <Link to={`/found/${item.id}`} className="ml-auto mr-2">
                  <Button variant="outline">查看详情</Button>
                </Link>
                {isSelf && <FoundEdit foundItemId={item.id} />}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
});
