import { useRef, useCallback, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { useAdminInfiniteUsers } from '@/hooks/useAdminInfinite';
import { SearchInput } from '@/components/searchInput/searchInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ITEM_HEIGHT = 280;
const PAGE_SIZE = 20;

const PUNISHMENT_TYPE_NAME: Record<number, string> = {
  1: '警告',
  2: '禁言',
  3: '封禁',
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [punishmentDialogOpen, setPunishmentDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminInfiniteUsers(PAGE_SIZE);

  const { data: punishments, isLoading: punishmentsLoading } = useQuery({
    queryKey: [...adminKeys.all, 'user-punishments', selectedUserId],
    queryFn: () => adminApi.getUserPunishments(selectedUserId!),
    enabled: selectedUserId !== null,
  });

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

  const unbanMutation = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.usersInfinite() });
      toast.success('用户已解封');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (punishmentId: number) => adminApi.revokePunishment(punishmentId),
    onSuccess: () => {
      toast.success('处罚已撤销');
      if (selectedUserId) {
        queryClient.invalidateQueries({
          queryKey: [...adminKeys.all, 'user-punishments', selectedUserId],
        });
      }
    },
    onError: () => {
      toast.error('撤销失败');
    },
  });

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const renderUserRow = useCallback(
    (user: (typeof filteredUsers)[0]) => (
      <Card key={user.id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">{user.name}</CardTitle>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedUserId(user.id);
                  setPunishmentDialogOpen(true);
                }}>
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
                  onClick={() => unbanMutation.mutate(user.id)}
                  disabled={unbanMutation.isPending}>
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
    ),
    [banMutation.isPending, unbanMutation.isPending]
  );

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          showLabel={false}
          placeholder="搜索用户..."
          value={searchQuery}
          onSearch={(value) => setSearchQuery(value)}
          className="w-64"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {searchQuery ? '未找到匹配的用户' : '暂无用户数据'}
        </p>
      ) : (
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
              const user = filteredUsers[virtualItem.index];
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
                  {renderUserRow(user)}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <Dialog open={punishmentDialogOpen} onOpenChange={setPunishmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>用户处罚记录</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {punishmentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : punishments && punishments.length > 0 ? (
              <div className="space-y-3">
                {punishments.map((punishment: any) => (
                  <Card key={punishment.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={punishment.type === 3 ? 'destructive' : 'secondary'}>
                            {PUNISHMENT_TYPE_NAME[punishment.type] || '未知'}
                          </Badge>
                          <p className="text-sm mt-2">原因: {punishment.reason || '未说明'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            处罚时间: {new Date(punishment.createdAt).toLocaleString()}
                          </p>
                          {punishment.expireAt && (
                            <p className="text-xs text-gray-500">
                              到期时间: {new Date(punishment.expireAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revokeMutation.mutate(punishment.id)}
                          disabled={revokeMutation.isPending}>
                          撤销
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无处罚记录</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPunishmentDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
