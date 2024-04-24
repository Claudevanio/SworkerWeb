'use client'
import { COLORS } from '@/utils';
import { LineConfig, Line } from '@ant-design/charts';

export const LineChart = ({
  data,
  xField,
  yField,
  height = 400,
  color = COLORS.primary['700'],
  field
} :{
  data: any[];
  xField: string;
  yField: string;
  height?: number;
  color?: string | string[];
  field?: string;
}) => {

  const chartConfig : LineConfig = {
    data,
    xField,
    yField,
    seriesField: field,
    isStack: !!field,
    height, 
    autoFit: true,
    color,
    tooltip: {
      showCrosshairs: true,
      shared: true,
    },
  };
  // return <div></div>

  return (
    <Line 
      {...chartConfig}
    />
  );
}