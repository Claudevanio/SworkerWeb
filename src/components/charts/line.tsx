'use client'
import { LineConfig, Line } from '@ant-design/charts';

export const LineChart = ({
  data,
  xField,
  yField,
  height = 400,
  color = '#00B5B8'
} :{
  data: any[];
  xField: string;
  yField: string;
  height?: number;
  color?: string;
}) => {

  const chartConfig = {
    data,
    xField,
    yField,
    height, 
    autoFit: true,
    label: {
      style: {
        fill: '#aaa',
      },
    },
    color
  };
  // return <div></div>

  return (
    <Line 
      {...chartConfig}
    />
  );
}