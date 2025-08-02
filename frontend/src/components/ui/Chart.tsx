import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: 'bar' | 'line' | 'doughnut';
  data: any;
  options?: any;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ type, data, options, height }) => {
  const chartProps = {
    data,
    options,
    height,
  };

  switch (type) {
    case 'bar':
      return <Bar {...chartProps} />;
    case 'line':
      return <Line {...chartProps} />;
    case 'doughnut':
      return <Doughnut {...chartProps} />;
    default:
      return null;
  }
};

export default Chart;