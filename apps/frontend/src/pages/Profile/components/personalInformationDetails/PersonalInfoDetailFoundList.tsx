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
import { memo } from 'react';
import { List } from 'react-window';
import { Link } from 'react-router';
import { FOUND_STATUS_NAME } from '../../types';
import FoundEdit from './FoundEdit';
import { useUserFoundInfinite } from '../../hooks/useUserFoundInfinite';
import { CellRowProps, CellRowPropsExplicit } from '@/types/type';
import { FoundItem } from '@lostfound/shared';

const ITEM_HEIGHT = 180;

function FoundRow(props: CellRowProps<FoundItem>) {
  const {
    index,
    style,
    data: { items, hasNextPage, isSelf },
  } = props as CellRowPropsExplicit<FoundItem>;

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
              item.status === FOUND_FILTER_STATUS.招领中
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
            {FOUND_STATUS_NAME[item.status]}
          </span>
          <Link to={`/found/${item.id}`} className="ml-auto mr-2">
            <Button variant="outline">查看详情</Button>
          </Link>
          {isSelf && <FoundEdit foundItemId={item.id} />}
        </CardFooter>
      </Card>
    </div>
  );
}

export default memo(function PersonalInfoDetailFoundList({
  userId,
  isSelf,
}: {
  userId: number;
  isSelf: boolean;
}) {
  const { parentRef, isFetching, status, rowCount, itemData, handleScroll } = useUserFoundInfinite(
    userId,
    isSelf
  );

  if (status === 'pending') {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6">我的招领信息</h2>
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
        <h2 className="text-2xl font-bold mb-6">我的招领信息</h2>
        <Card>
          <CardContent>
            <p className="text-gray-600 text-center py-12">暂无招领记录</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold">我的招领信息</h2>
      <div ref={parentRef} className="h-[650px] relative ">
        <List
          style={{ scrollbarWidth: 'none' }}
          rowHeight={ITEM_HEIGHT}
          rowCount={rowCount}
          onScroll={handleScroll}
          rowProps={{ data: itemData }}
          rowComponent={FoundRow}
        />
      </div>
      {isFetching && status !== 'success' && (
        <div className="bg-green-50 text-green-600 text-center py-1 text-sm">加载中...</div>
      )}
    </>
  );
});
