import React from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  progressContainer: {
    width: '100%',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    height: '2.5',
  },
  progressFill: {
    backgroundColor: token.colorPrimary,
    height: '2.5',
    borderRadius: token.borderRadius,
  },
}));

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  const { styles } = useStyles();
  
  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div 
        className={styles.progressFill}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  );
};

export default Progress;