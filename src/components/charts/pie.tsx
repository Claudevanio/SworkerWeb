"use client";
import { Pie } from "@ant-design/plots";

type PropsPie = {
  data: {
    type: string;
    value: number;
  }[];
};

export const PieChart = ({ data }: PropsPie) => {
  const config = {
    data: data,
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "bottom-left",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config}  />;
};
