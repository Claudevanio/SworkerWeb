'use client'
import { COLORS } from '@/utils';
import { BarConfig, Bar } from '@ant-design/charts';

export const BarChart = ({
  data,
  xField,
  yField,
  height = 400,
  color = COLORS.primary['600'],
  typeOrder 
} :{
  data: any[];
  xField: string;
  yField: string;
  height?: number;
  color?: string | string[];
  typeOrder?: string[];
}) => {

  const chartConfig : BarConfig = {
    data,
    seriesField: 'type',
    isStack: true,
    xField,
    yField,
    height,   
    autoFit: true,
    color,
    tooltip: {
      showCrosshairs: true,
      shared: true,
    },  
    columnBackground: COLORS['base']['1'] as any,
    barStyle: {
      radius: [20, 20, 0, 0], 
    },
  };
  // return <div></div>

  return (
    <Bar 
      {...chartConfig}
    />
  );
}