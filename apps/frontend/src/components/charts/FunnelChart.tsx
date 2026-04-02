import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ItemFunnel } from '@lostfound/shared';

interface FunnelChartProps {
  data: ItemFunnel[];
  title?: string;
}

export function FunnelChart({ data, title }: FunnelChartProps) {
  const option = useMemo(() => {
    return {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: title || '漏斗',
          type: 'funnel',
          left: '10%',
          top: 40,
          bottom: 40,
          width: '80%',
          min: 0,
          max: data[0]?.count || 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'none',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}\n{c}',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 14,
            },
          },
          data: data.map((item, index) => ({
            value: item.count,
            name: item.stage,
            itemStyle: {
              color: item.type === 'lost' ? '#3b82f6' : '#10b981',
              opacity: 1 - index * 0.15,
            },
          })),
        },
      ],
    };
  }, [data, title]);

  return <ReactECharts option={option} style={{ height: 300 }} />;
}
