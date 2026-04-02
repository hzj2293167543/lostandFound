import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloudChart } from '@/components/charts';
import type { WordCloudData } from '@lostfound/shared';

interface WordCloudSectionProps {
  wordCloudData: WordCloudData | undefined;
}

export function WordCloudSection({ wordCloudData }: WordCloudSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>关键词云</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WordCloudChart data={wordCloudData?.lostWords || []} title="失物关键词" />
          <WordCloudChart data={wordCloudData?.foundWords || []} title="招领关键词" />
        </div>
      </CardContent>
    </Card>
  );
}
