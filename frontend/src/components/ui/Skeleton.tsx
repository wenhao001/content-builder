import React from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  skeleton: {
    backgroundColor: token.colorBgContainer,
    animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
}));

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  const { styles } = useStyles();
  
  return (
    <div
      className={`${styles.skeleton} animate-pulse ${className}`}
    />
  );
};

export default Skeleton;