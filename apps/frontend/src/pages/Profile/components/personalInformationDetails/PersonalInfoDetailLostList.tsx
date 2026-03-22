import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LOST_STATUS_NAME, LOST_STATUS } from '../../types';
import { memo } from 'react';
import { List } from 'react-window';
import LostEdit from './LostEdit';
import { Link } from 'react-router-dom';
import { useUserLostInfinite } from '../../hooks/useUserLostInfinite';
import { CellRowProps, CellRowPropsExplicit } from '@/types/type';
import { LostItem } from '@lostfound/shared';

const ITEM_HEIGHT = 180;

function LostRow(props: CellRowProps<LostItem>) {
  const {
    index,
    style,
    data: { items, hasNextPage, isSelf },
  } = props as CellRowPropsExplicit<LostItem>;

  if (index >= items.length) {
    return (
      <div style={style} className="px-3 py-2">
        <div className="flex justify-center items-center py-4">
          {hasNextPage ? (
            <p className="text-gray-500">加载中...</p>
          ) : (
            <p className="text-gray-400">没有更多了</p>
          )}
        </div>
      </div>
    );
  }

  const item = items[index];
  if (!item) return null;

  return (
    <div style={style} className="px-3 py-3">
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>
            分类：{item.category.name} | 发布时间：{item.time}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              item.status === LOST_STATUS.寻找中
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
            {LOST_STATUS_NAME[item.status]}
          </span>
          <Link to={`/lost/${item.id}`} className="ml-auto mr-2">
            <Button variant="outline">查看详情</Button>
          </Link>
          {isSelf && <LostEdit lostItemId={item.id} />}
        </CardFooter>
      </Card>
    </div>
  );
}

export default memo(function PersonalInfoDetailLostList({
  userId,
  isSelf,
}: {
  userId: number;
  isSelf: boolean;
}) {
  const { parentRef, isFetching, status, rowCount, itemData, handleScroll } = useUserLostInfinite(
    userId,
    isSelf
  );

  if (status === 'pending') {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">我的失物信息</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">加载中...</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (itemData.items.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">我的失物信息</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">暂无失物记录</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold">我的失物信息</h2>
      <div ref={parentRef} className="h-[650px] relative ">
        <List
          style={{ scrollbarWidth: 'none' }}
          rowHeight={ITEM_HEIGHT}
          rowCount={rowCount}
          onScroll={handleScroll}
          rowProps={{ data: itemData }}
          rowComponent={LostRow}
        />
      </div>
      {isFetching && status !== 'success' && (
        <div className="bg-blue-50 text-blue-600 text-center py-1 text-sm">加载中...</div>
      )}
    </>
  );
});
