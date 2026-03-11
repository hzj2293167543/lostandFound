import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { lostApi, foundApi, userApi } from '@/api';
import { LostItem, FoundItem } from '@lostfound/shared';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    lostCount: 0,
    foundCount: 0,
    userCount: 0,
  });
  const [recentLost, setRecentLost] = useState<LostItem[]>([]);
  const [recentFound, setRecentFound] = useState<FoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lostItems, foundItems] = await Promise.all([
          lostApi.getLostItems(),
          foundApi.getFoundItems(),
        ]);

        setStats({
          lostCount: lostItems.length,
          foundCount: foundItems.length,
          userCount: 0, // 需要添加用户计数 API
        });
        setRecentLost(lostItems.slice(0, 5));
        setRecentFound(foundItems.slice(0, 5));
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>加载中...</div>;
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
            <div className="text-3xl font-bold">{stats.lostCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">招领总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.foundCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">用户总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.userCount}</div>
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
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.time}</span>
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
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.time}</span>
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
