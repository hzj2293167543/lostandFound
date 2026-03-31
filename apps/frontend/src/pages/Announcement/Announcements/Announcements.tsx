import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CellRowProps, CellRowPropsExplicit } from '@/types/type';
import { Announcement, GetAnnouncementsParams } from '@lostfound/shared';
import { useState } from 'react';
import { Link } from 'react-router';
import { List } from 'react-window';
import { useAnnouncementInfinite } from '../hooks/useAnnouncementInfinite.hook';
import { SearchInput } from '@/components/searchInput/searchInput';
import { SEARCH_DEBOUNCE_DELAY } from '@/constants';

const ITEM_HEIGHT = 220;

function Row(props: CellRowProps<Announcement>) {
  const {
    index,
    style,
    data: { items, hasNextPage },
  } = props as CellRowPropsExplicit<Announcement>;
  if (index >= items.length) {
    return (
      <div style={style} className="px-3 py-2">
        <div className="flex justify-center items-center py-4">
          {hasNextPage ? (
            <p className="text-gray-500">加载中...</p>
          ) : (
            <p className="text-gray-400">没有更多公告</p>
          )}
        </div>
      </div>
    );
  }

  const announcement = items[index];
  if (!announcement) return null;

  return (
    <div style={style} className="px-3 py-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl line-clamp-1">{announcement.title}</CardTitle>
          </div>
          <CardDescription>
            发布时间：{announcement.time} | 发布者：{announcement.author.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
        </CardContent>
        <CardFooter>
          <Link to={`/announcements/${announcement.id}`} className="text-blue-600 hover:underline">
            查看详情
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function AnnouncementError({ status }: { status: 'error' | 'empty' }) {
  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">加载失败，请重试</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-600 text-lg">没有找到匹配的公告</p>
    </div>
  );
}

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');

  const filters: GetAnnouncementsParams = {
    search: searchTerm || undefined,
  };

  const { itemData, handleScroll, status, rowCount, containerRef, allItems, isFetching } =
    useAnnouncementInfinite(filters);

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">公告中心</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="space-y-2">
          <SearchInput
            placeholder="搜索公告标题或内容"
            onSearch={(value) => setSearchTerm(value)}
            delay={SEARCH_DEBOUNCE_DELAY}
          />
        </div>
      </div>

      <div ref={containerRef} className="flex-1 h-[calc(100vh-64px)] relative">
        {status === 'error' && <AnnouncementError status="error" />}
        {status === 'success' && allItems.length === 0 && <AnnouncementError status="empty" />}
        {status === 'success' && (
          <List
            style={{ scrollbarWidth: 'none' }}
            rowCount={rowCount!}
            rowHeight={ITEM_HEIGHT}
            onScroll={handleScroll}
            rowProps={{ data: itemData }}
            rowComponent={Row}
          />
        )}
        {isFetching && status !== 'success' && (
          <div className="absolute top-0 left-0 right-0 bg-blue-50 text-blue-600 text-center py-1 text-sm">
            加载中...
          </div>
        )}
      </div>
    </div>
  );
}
