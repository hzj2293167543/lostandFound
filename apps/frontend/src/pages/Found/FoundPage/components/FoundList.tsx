import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FOUND_STATUS_NAME } from '@/pages/Profile/types';
import { CellProps, CellPropsExplicit } from '@/types/type';
import { FoundItem, GetFoundItemsParams } from '@lostfound/shared';
import { Link } from 'react-router-dom';
import { Grid } from 'react-window';
import { useFoundInfinite } from '../../hooks/useFoundInfinite.hook';
import { FOUND_FILTER_STATUS } from '../../type';
import { ITEM_HEIGHT, COLUMN_COUNT } from '@/constants';

interface FoundListProps {
  filters?: GetFoundItemsParams;
}

export default function FoundList({ filters }: FoundListProps) {
  const {
    itemData,
    handleScroll,
    status,
    rowCount,
    columnCount,
    columnWidth,
    containerWidth,
    containerRef,
    allItems,
    isFetching,
  } = useFoundInfinite(filters);

  return (
    <div ref={containerRef} className="h-[calc(100vh-264px)] w-full relative">
      {containerWidth === null ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <>
          {status === 'error' && <FoundError status="error" />}
          {status === 'success' && allItems.length === 0 && <FoundError status="empty" />}
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
            <div className="absolute top-0 left-0 right-0 bg-success/10 text-success text-center py-1 text-sm">
              加载中...
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Cell(props: CellProps<FoundItem>) {
  const { columnIndex, rowIndex, style, data } = props as CellPropsExplicit<FoundItem>;
  const { items, hasNextPage } = data;
  const index = rowIndex * COLUMN_COUNT + columnIndex;

  if (index >= items.length) {
    if (rowIndex > 0 && columnIndex === 0) {
      return (
        <div style={style} className="p-3">
          <div className="flex justify-center items-center py-8">
            {hasNextPage ? (
              <p className="text-muted-foreground">加载中...</p>
            ) : (
              <p className="text-muted-foreground">没有更多招领信息</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  }

  const item = items[index];
  if (!item) return null;

  return (
    <div style={style} className="p-3">
      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="h-48 overflow-hidden">
          <img
            src={item.image || new URL('@/assets/image/not-image.png', import.meta.url).toString()}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>
              <span>{item.title}</span>
            </CardTitle>
            <span
              className={`px-2 py-1 rounded-full text-xs ${item.status === FOUND_FILTER_STATUS.招领中 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
              {FOUND_STATUS_NAME[item.status]}
            </span>
          </div>
          <CardDescription>分类：{item.category.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>捡到时间：{item.time}</p>
            <p>捡到地点：{item.location}</p>
          </div>
          <div className="flex items-center mt-4">
            <img
              src={
                item.user?.avatar ||
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
              }
              alt={item.user?.name || '未知用户'}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm">{item.user?.name || '未知用户'}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to={`/found/${item.id}`} className="text-green-600 hover:underline">
            查看详情
          </Link>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">{item.commentCount || 0} 条评论</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function FoundError({ status }: { status: 'error' | 'empty' }) {
  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">加载失败，请重试</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-muted-foreground text-lg">没有找到匹配的失物信息</p>
    </div>
  );
}
