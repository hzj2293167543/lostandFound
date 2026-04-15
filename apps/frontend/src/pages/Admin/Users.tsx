import { adminApi } from '@/api';
import { SearchInput } from '@/components/searchInput/searchInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminInfiniteUsers } from '@/hooks/useAdminInfinite';
import { adminKeys } from '@/queryKeys/admin.key';
import { formatDate } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { VirtualizedUserList } from './components/VirtualizedUserList';

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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminInfiniteUsers(PAGE_SIZE);

  const { data: punishments, isLoading: punishmentsLoading } = useQuery({
    queryKey: [...adminKeys.all, 'user-punishments', selectedUserId],
    queryFn: () => adminApi.getUserPunishments(selectedUserId!),
    enabled: selectedUserId !== null,
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

  const handleViewPunishments = (userId: number) => {
    setSelectedUserId(userId);
    setPunishmentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">用户管理</h2>
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
        <VirtualizedUserList
          users={filteredUsers}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onViewPunishments={handleViewPunishments}
        />
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
                {punishments.map((punishment) => (
                  <Card key={punishment.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={punishment.type === 3 ? 'destructive' : 'secondary'}>
                            {PUNISHMENT_TYPE_NAME[punishment.type] || '未知'}
                          </Badge>
                          <p className="text-sm mt-2">原因: {punishment.reason || '未说明'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            处罚时间: {formatDate(punishment.createdAt)}
                          </p>
                          {punishment.expireAt && (
                            <p className="text-xs text-gray-500">
                              到期时间: {formatDate(punishment.expireAt)}
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
