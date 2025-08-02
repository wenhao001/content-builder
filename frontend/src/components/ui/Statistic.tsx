import React from 'react';

interface StatisticProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const Statistic: React.FC<StatisticProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  return (
    <div className={`text-3xl font-bold ${className}`}>
      {prefix}
      {value}
      {suffix}
    </div>
  );
};

export default Statistic;