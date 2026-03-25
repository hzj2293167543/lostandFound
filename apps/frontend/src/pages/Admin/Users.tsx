import { useRef, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { adminApi } from '@/api';
import { SearchInput } from '@/components/searchInput/searchInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminKeys } from '@/keys/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: number;
  reporterId: number;
  reportedUserId: number;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

const ITEM_HEIGHT = 220;

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => adminApi.getAllUsers(),
  });

  const banMutation = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId, 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('用户已封禁');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: number) => adminApi.updateUserStatus(userId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('用户已解封');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });

  const handleBanUser = (userId: number) => {
    banMutation.mutate(userId);
  };

  const handleUnbanUser = (userId: number) => {
    unbanMutation.mutate(userId);
  };

  const handleResolveReport = (reportId: number) => {
    toast.success('举报已处理');
  };

  const handleRejectReport = (reportId: number) => {
    toast.success('举报已忽略');
  };

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
    (user: (typeof users)[0]) => (
      <Card key={user.id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">{user.name}</CardTitle>
            <div className="space-x-2">
              {user.status === 1 ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBanUser(user.id)}
                  disabled={banMutation.isPending}>
                  封禁
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleUnbanUser(user.id)}
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
            <p>状态: {user.status === 1 ? '正常' : '已封禁'}</p>
          </div>
        </CardContent>
      </Card>
    ),
    [banMutation.isPending, unbanMutation.isPending]
  );

  const mockReports: Report[] = [];
  const pendingReportsCount = mockReports.filter((r) => r.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}>
          用户列表
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveTab('reports')}>
          举报列表
          {pendingReportsCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingReportsCount}
            </Badge>
          )}
        </Button>
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SearchInput
              className="w-64"
              label="用户列表"
              placeholder="搜索用户..."
              value={searchQuery}
              onSearch={(e) => setSearchQuery(e)}
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
              style={{ scrollbarWidth: 'none' }}>
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const user = filteredUsers[virtualItem.index];
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
                      {renderUserRow(user!)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <h2 className="text-xl font-bold mb-4">举报列表</h2>
          {mockReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无举报记录</p>
          ) : (
            <div className="space-y-4">
              {mockReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        举报用户 ID: {report.reportedUserId}
                      </CardTitle>
                      <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                        {report.status === 'pending'
                          ? '待处理'
                          : report.status === 'resolved'
                            ? '已处理'
                            : '已拒绝'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>举报原因: {report.reason}</p>
                      <p>举报时间: {report.createdAt}</p>
                      {report.status === 'pending' && (
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              handleResolveReport(report.id);
                              handleBanUser(report.reportedUserId);
                            }}>
                            封禁用户
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReport(report.id)}>
                            忽略
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
