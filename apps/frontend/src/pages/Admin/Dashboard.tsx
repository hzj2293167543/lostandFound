import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/api';
import { adminKeys } from '@/keys/admin';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.getStats(),
  });

  const { data: recentLost = [], isLoading: lostLoading } = useQuery({
    queryKey: adminKeys.recentLost(),
    queryFn: () => adminApi.getRecentLostItems(),
  });

  const { data: recentFound = [], isLoading: foundLoading } = useQuery({
    queryKey: adminKeys.recentFound(),
    queryFn: () => adminApi.getRecentFoundItems(),
  });

  const isLoading = statsLoading || lostLoading || foundLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">控制台</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">失物总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.lostCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">招领总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.foundCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">用户总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.userCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近失物</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLost.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium truncate">{item.title}</span>
                  <span className="text-sm text-gray-500 ml-2 shrink-0">{item.time}</span>
                </div>
              ))}
              {recentLost.length === 0 && <p className="text-gray-500">暂无数据</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>最近招领</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFound.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium truncate">{item.title}</span>
                  <span className="text-sm text-gray-500 ml-2 shrink-0">{item.time}</span>
                </div>
              ))}
              {recentFound.length === 0 && <p className="text-gray-500">暂无数据</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
