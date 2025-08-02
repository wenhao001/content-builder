import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses =
    variant === 'destructive'
      ? 'bg-red-50 text-red-800 border-red-200'
      : 'bg-blue-50 text-blue-800 border-blue-200';

  return (
    <div
      className={`border rounded-lg p-4 ${variantClasses} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Alert;