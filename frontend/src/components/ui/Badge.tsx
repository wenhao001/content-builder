import React from 'react';
import classNames from 'classnames';
import { IconType } from 'react-icons';

/**
 * Badge variants
 * - primary: Primary color scheme
 * - secondary: Secondary color scheme
 * - outline: Outline style
 * - success: Success color scheme
 * - warning: Warning color scheme
 * - danger: Danger color scheme
 * - info: Info color scheme
 */
type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Badge sizes
 * - sm: Small size
 * - md: Medium size (default)
 * - lg: Large size
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The variant of the badge
   * @default 'secondary'
   */
  variant?: BadgeVariant;
  /**
   * The size of the badge
   * @default 'md'
   */
  size?: BadgeSize;
  /**
   * Whether the badge is pill-shaped
   * @default false
   */
  pill?: boolean;
  /**
   * Icon to display before the content
   */
  icon?: IconType;
  /**
   * The content of the badge
   */
  children?: React.ReactNode;
  /**
   * Additional class names
   */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  pill = false,
  icon: IconComponent,
  children,
  className,
  ...props
}) => {
  // Base badge classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors';

  // Border radius classes
  const radiusClasses = pill ? 'rounded-full' : 'rounded-md';

  // Size classes
  const sizeClasses = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-2.5 text-xs',
    lg: 'h-7 px-3 text-sm',
  }[size];

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input bg-background text-foreground hover:bg-muted',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    info: 'bg-info text-info-foreground hover:bg-info/90',
  }[variant];

  // Combine all classes
  const combinedClasses = classNames(
    baseClasses,
    radiusClasses,
    sizeClasses,
    variantClasses,
    className
  );

  return (
    <span className={combinedClasses} {...props}>
      {IconComponent && <IconComponent className="mr-1.5 h-3.5 w-3.5" />}
      {children}
    </span>
  );
};

export default Badge;