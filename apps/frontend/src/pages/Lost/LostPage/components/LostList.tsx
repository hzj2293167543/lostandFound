import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LOST_STATUS_NAME } from '@/pages/Profile/types';
import { GetLostItemsParams, LostItem } from '@lostfound/shared';
import { Link } from 'react-router';
import { Grid } from 'react-window';
import { LOST_FILTER_STATUS } from '../../type';
import { useLostInfiniteQuery } from '../hooks/useLostInfiniteQuery';
interface LostListProps {
  filters?: GetLostItemsParams;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    items: LostItem[];
    hasNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    isFetchingNextPage: boolean;
  };
}
// 布局常量
const COLUMN_COUNT = 3; // 最大列数（lg 屏）
const ITEM_HEIGHT = 430; // 每行高度（px）

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
  } = useLostInfiniteQuery(filters);

  // 渲染状态
  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">加载失败，请重试</p>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">没有找到匹配的失物信息</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        defaultHeight={600}
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT}
        defaultWidth={containerWidth}
        onScroll={handleScroll}
        className=""
        cellProps={{}}
        cellComponent={({ columnIndex, rowIndex, style }) => (
          <Cell
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            style={style}
            data={itemData} // 直接读取外部变量
          />
        )}
      />
    </div>
  );
}

// 单元格组件，独立渲染每个卡片
function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const { items, hasNextPage } = data;
  const index = rowIndex * COLUMN_COUNT + columnIndex;

  // 渲染“加载更多”提示（仅在第一列显示，避免重复）
  if (index >= items.length) {
    if (rowIndex > 0 && columnIndex === 0) {
      return (
        <div style={style} className="p-3">
          <div className="flex justify-center items-center py-8">
            {hasNextPage ? (
              <p className="text-gray-500">加载中...</p>
            ) : (
              <p className="text-gray-400">没有更多了</p>
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
