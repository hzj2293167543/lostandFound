import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserActivityData {
  userName: string;
  postCount: number;
}

interface UserActivityChartProps {
  userActivity: UserActivityData[];
}

export function UserActivityChart({ userActivity }: UserActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>用户活跃度 Top 10（发布）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivity} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="userName" type="category" width={80} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="postCount" fill="var(--chart-4)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
