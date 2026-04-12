import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/keys/admin';
import { toast } from 'sonner';

const ITEM_HEIGHT = 240;

interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  status: number;
  role: number;
}

interface VirtualizedUserListProps {
  users: User[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onViewPunishments: (userId: number) => void;
}

export function VirtualizedUserList({
  users,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onViewPunishments,
}: VirtualizedUserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const banMutation = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId, 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.usersInfinite() });
      toast.success('用户已封禁');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });

  const unBanMutation = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.usersInfinite() });
      toast.success('用户已解封');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    measureElement: (el) => el.scrollHeight,
    overscan: 5,
  });

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      ref={parentRef}
      className="h-[650px] overflow-auto"
      style={{ scrollbarWidth: 'none' }}
      onScroll={handleScroll}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const user = users[virtualItem.index];
          if (!user) return null;
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                padding: '0 0 16px 0',
              }}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewPunishments(user.id)}>
                        处罚记录
                      </Button>
                      {user.status === 1 ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => banMutation.mutate(user.id)}
                          disabled={banMutation.isPending}>
                          封禁
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => unBanMutation.mutate(user.id)}
                          disabled={unBanMutation.isPending}>
                          解封
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>邮箱: {user.email}</p>
                    <p>电话: {user.contact}</p>
                    <p>角色: {user.role === 1 ? '管理员' : '普通用户'}</p>
                    <p>{user.status === 1 ? '正常' : '已封禁'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
