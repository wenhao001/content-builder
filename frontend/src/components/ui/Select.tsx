import React from 'react';

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> & {
  Item: React.FC<SelectItemProps>;
} = ({ value, onChange, children, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
    >
      {children}
    </select>
  );
};

Select.Item = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export default Select;