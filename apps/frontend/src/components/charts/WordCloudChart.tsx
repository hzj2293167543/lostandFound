import type { WordCloudItem } from '@lostfound/shared';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import 'echarts-wordcloud';

interface WordCloudChartProps {
  data: WordCloudItem[];
  title?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export function WordCloudChart({ data, title }: WordCloudChartProps) {
  const option = useMemo(() => {
    return {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        show: true,
        formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value}次`,
      },
      series: [
        {
          name: title || '词云',
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 40,
          width: '90%',
          height: '80%',
          sizeRange: [14, 40],
          rotationRange: [-45, 45],
          rotationStep: 15,
          gridSize: 8,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          },
          emphasis: {
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
          data: data.map((item, index) => ({
            name: item.word,
            value: item.count,
            textStyle: {
              color: COLORS[index % COLORS.length],
            },
          })),
        },
      ],
    };
  }, [data, title]);

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
