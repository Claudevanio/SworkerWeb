import { Column, ColumnConfig } from '@ant-design/charts';

export const ColumnChart = ({
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

  const chartConfig : ColumnConfig = {
    data,
    xField,
    yField,
    height, 
    autoFit: true,  
    color, 
    columnStyle: {
      radius: [20, 20, 0, 0], 
    },
  }; 

  return (
    <Column {...chartConfig} />
  );
}