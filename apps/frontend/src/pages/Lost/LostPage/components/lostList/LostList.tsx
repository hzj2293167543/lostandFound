import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COLUMN_COUNT, ITEM_HEIGHT } from '@/constants';
import { LOST_STATUS_NAME } from '@/pages/Profile/types';
import { CellProps, CellPropsExplicit } from '@/types/type';
import { GetLostItemsParams, LostItem } from '@lostfound/shared';
import { Link } from 'react-router';
import { Grid } from 'react-window';
import { LOST_FILTER_STATUS } from '../../../type';
import { useLostInfiniteQuery } from '../../hooks/useLostInfiniteQuery';

interface LostListProps {
  filters?: GetLostItemsParams;
}

function Cell(props: CellProps<LostItem>) {
  const { columnIndex, rowIndex, style, data } = props as CellPropsExplicit<LostItem>;
  const { items, hasNextPage } = data;
  const index = rowIndex * COLUMN_COUNT + columnIndex;

  if (index >= items.length) {
    if (rowIndex > 0 && columnIndex === 0) {
      return (
        <div style={style} className="p-3">
          <div className="flex justify-center items-center py-8">
            {hasNextPage ? (
              <p className="text-gray-500">加载中...</p>
            ) : (
              <p className="text-gray-400">没有更多失物信息</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  const item = items[index];
  if (!item) {
    return null;
  }

  return (
    <div style={style} className="p-3">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="h-48 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="line-clamp-1">{item.title}</CardTitle>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.status === LOST_FILTER_STATUS.寻找中
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
              {LOST_STATUS_NAME[item.status]}
            </span>
          </div>
          <CardDescription>分类：{item.category.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>丢失时间：{item.time}</p>
            <p>可能地点：{item.location}</p>
          </div>
          <div className="flex items-center mt-4">
            <img
              src={item.user.avatar}
              alt={item.user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{item.user.name}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to={`/lost/${item.id}`} className="text-blue-600 hover:underline">
            查看详情
          </Link>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">{item.commentCount} 条评论</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function LostError({ status }: { status: 'error' | 'empty' }) {
  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">加载失败，请重试</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-600 text-lg">没有找到匹配的失物信息</p>
    </div>
  );
}

export default function LostList({ filters }: LostListProps) {
  const {
    containerRef,
    columnCount,
    columnWidth,
    containerWidth,
    handleScroll,
    itemData,
    rowCount,
    status,
    allItems,
    isFetching,
  } = useLostInfiniteQuery(filters);

  return (
    <div ref={containerRef} className="h-full w-full" style={{ scrollbarWidth: 'none' }}>
      {containerWidth === null ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
        <>
          {status === 'error' && <LostError status="error" />}
          {status === 'success' && allItems.length === 0 && <LostError status="empty" />}
          {status === 'success' && (
            <Grid
              style={{ scrollbarWidth: 'none' }}
              columnCount={columnCount!}
              columnWidth={columnWidth!}
              rowCount={rowCount!}
              rowHeight={ITEM_HEIGHT}
              onScroll={handleScroll}
              cellProps={{ data: itemData }}
              cellComponent={Cell}
            />
          )}
          {isFetching && status !== 'success' && (
            <div className="absolute top-0 left-0 right-0 bg-blue-50 text-blue-600 text-center py-1 text-sm">
              加载中...
            </div>
          )}
        </>
      )}
    </div>
  );
}
