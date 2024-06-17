'use client';
import { Pie, PieConfig } from '@ant-design/plots';

type PropsPie = {
  data: {
    type: string;
    value: number;
  }[];
};

export const PieChart = ({ data }: PropsPie) => {
  const config: PieConfig = {
    data: data,
    angleField: 'value',
    colorField: 'type',
    legend: {
      color: {
        title: false,
        position: 'bottom-left',
        rowPadding: 5
      }
    },
    label: {
      type: 'inner',
      style: {
        opacity: 0
      }
    }
  };
  return <Pie {...config} />;
};
