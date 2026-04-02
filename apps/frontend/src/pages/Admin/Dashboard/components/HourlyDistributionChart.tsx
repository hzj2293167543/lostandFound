import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyData {
  hour: number;
  count: number;
}

interface HourlyDistributionChartProps {
  lostHourly: HourlyData[];
  foundHourly: HourlyData[];
}

export function HourlyDistributionChart({ lostHourly, foundHourly }: HourlyDistributionChartProps) {
  const data = Array.from({ length: 24 }, (_, h) => {
    const lost = lostHourly.find((d) => d.hour === h)?.count || 0;
    const found = foundHourly.find((d) => d.hour === h)?.count || 0;
    return { hour: `${h}:00`, lost, found };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>按小时分布（失物 vs 招领）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lost" name="失物" fill="#3b82f6" />
            <Bar dataKey="found" name="招领" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
