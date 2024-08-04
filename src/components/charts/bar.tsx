'use client';
import { COLORS } from '@/utils';
import { BarConfig, Bar } from '@ant-design/charts';

export const BarChart = ({
  data,
  xField,
  yField,
  height = 400,
  color = COLORS.primary['600'],
  typeOrder
}: {
  data: any[];
  xField: string;
  yField: string;
  height?: number;
  color?: string | string[];
  typeOrder?: string[];
}) => {
  const chartConfig: BarConfig = {
    data,
    seriesField: 'type',
    isStack: true,
    xField,
    yField,
    height,
    autoFit: true,
    animation: false,
    color,
    tooltip: {
      showCrosshairs: true,
      shared: true
    },
    label: {
      position: 'right',
      style: {
        fill: COLORS['base']['7'] as any,
        fontWeight: 'bold'
      },
      formatter: (v, item) => {
        return `${item._origin['type'] === typeOrder[0] ? '' : item._origin[xField]}`;
      }
    },
    columnBackground: COLORS['base']['1'] as any,
    barStyle: {
      radius: [20, 20, 0, 0]
    }
  };
  // return <div></div>

  return <Bar {...chartConfig} />;
};
