import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  dayName: string;
  lostCount: number;
  foundCount: number;
}

interface WeeklyDistributionChartProps {
  weekly: WeeklyData[];
}

export function WeeklyDistributionChart({ weekly }: WeeklyDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>按星期分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lostCount" name="失物" fill="#3b82f6" />
            <Bar dataKey="foundCount" name="招领" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
