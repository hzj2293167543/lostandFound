import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelChart } from '@/components/charts';
import type { FunnelData } from '@lostfound/shared';

interface FunnelSectionProps {
  funnelData: FunnelData | undefined;
}

export function FunnelSection({ funnelData }: FunnelSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>物品状态变化漏斗</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FunnelChart data={funnelData?.lostFunnel || []} title="失物流程" />
          <FunnelChart data={funnelData?.foundFunnel || []} title="招领流程" />
        </div>
      </CardContent>
    </Card>
  );
}
