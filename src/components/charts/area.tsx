import { Area, AreaConfig } from '@ant-design/charts';

export const AreaChart = ({
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

  const chartConfig : AreaConfig = {
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
    color,
    areaStyle: {
      fill: 'l(270) 0:#a19d9da1 0.5:#a19d9da1 1:'+color,
    }
  }; 

  return (
    <Area {...chartConfig} />
  );
}