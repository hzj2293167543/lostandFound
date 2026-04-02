import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportStatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ReportChartsProps {
  reportStats: ReportStatsData | undefined;
}

const COLORS = ['#f59e0b', '#10b981', '#ef4444'];

export function ReportCharts({ reportStats }: ReportChartsProps) {
  const pieData = reportStats
    ? [
        { name: '待处理', value: reportStats.pending },
        { name: '已通过', value: reportStats.approved },
        { name: '已驳回', value: reportStats.rejected },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>举报处理状态</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value">
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">暂无数据</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>举报统计概览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">总举报数</span>
            <span className="text-xl font-bold">{reportStats?.total || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">待处理</span>
            <span className="text-xl font-bold text-yellow-500">{reportStats?.pending || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">已通过</span>
            <span className="text-xl font-bold text-green-500">{reportStats?.approved || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">已驳回</span>
            <span className="text-xl font-bold text-red-500">{reportStats?.rejected || 0}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
