import React from 'react';
import classNames from 'classnames';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Whether the button is full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Whether the button is loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * The icon to display in the button
   */
  icon?: React.ReactNode;
  /**
   * The position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * The type of the button
   * @default 'button'
   */
  type?: ButtonType;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * The content of the button
   */
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className,
  children,
  disabled = false,
  ...props
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary',
    ghost: 'bg-background text-foreground hover:bg-muted focus:ring-muted',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    success: 'bg-success text-success-foreground hover:bg-success/90 focus:ring-success',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning',
  }[variant];

  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-11 px-6 text-lg',
    icon: 'h-10 w-10 p-0',
  }[size];

  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Loading state class
  const loadingClass = isLoading ? 'opacity-75' : '';

  // Combine all classes
  const combinedClasses = classNames(
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClass,
    loadingClass,
    className
  );

  // Icon and children positioning
  const renderContent = () => {
    if (isLoading) {
      return (
        <>          
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>加载中...</span>
        </>
      );
    }

    if (icon) {
      if (iconPosition === 'left') {
        return (
          <>            
            {icon}
            {children && <span className="ml-2">{children}</span>}
          </>
        );
      } else {
        return (
          <>            
            {children && <span className="mr-2">{children}</span>}
            {icon}
          </>
        );
      }
    }

    return children;
  };

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;