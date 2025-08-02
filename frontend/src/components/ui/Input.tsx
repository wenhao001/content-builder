import React from 'react';
import classNames from 'classnames';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

type InputVariant = 'default' | 'secondary' | 'destructive';
type InputSize = 'sm' | 'md' | 'lg';
type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The variant of the input
   * @default 'default'
   */
  variant?: InputVariant;
  /**
   * The size of the input
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input has an error
   * @default false
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * Whether the input is loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  /**
   * Whether the input is a password with toggle
   * @default false
   */
  withPasswordToggle?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * The label for the input
   */
  label?: string;
  /**
   * The ID for the input (used for label association)
   */
  id?: string;
}

const Input: React.FC<InputProps> = (
  {
    variant = 'default',
    size = 'md',
    disabled = false,
    error = false,
    errorMessage,
    isLoading = false,
    leftIcon,
    rightIcon,
    withPasswordToggle = false,
    className,
    label,
    id,
    type = 'text',
    ...props
  }
) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Determine input type based on password toggle
  const inputType = withPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  // Base input classes
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  // Variant classes
  const variantClasses = {
    default: '',
    secondary: 'bg-muted',
    destructive: error ? 'border-destructive focus-visible:ring-destructive' : '',
  }[variant];

  // Size classes
  const sizeClasses = {
    sm: 'h-9 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  }[size];

  // Error classes
  const errorClasses = error ? 'border-destructive focus-visible:ring-destructive' : '';

  // Combine all input classes
  const inputClasses = classNames(
    baseClasses,
    variantClasses,
    sizeClasses,
    errorClasses,
    className
  );

  // Password toggle icon
  const passwordToggleIcon = withPasswordToggle ? (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="ml-2 text-muted-foreground hover:text-foreground"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  ) : null;

  // Loading icon
  const loadingIcon = isLoading ? (
    <div className="ml-2 flex items-center">
      <Loader2 size={16} className="animate-spin text-muted-foreground" />
    </div>
  ) : null;

  // Right element (priority: loading > password toggle > rightIcon)
  const rightElement = loadingIcon || passwordToggleIcon || (rightIcon ? <div className="ml-2">{rightIcon}</div> : null);

  return (
    <div className="input-wrapper space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="flex items-center">
          {leftIcon && <div className="mr-2">{leftIcon}</div>}
          <input
            id={inputId}
            type={inputType}
            disabled={disabled || isLoading}
            className={inputClasses}
            {...props}
          />
          {rightElement}
        </div>
      </div>
      {error && errorMessage && (
        <p className="text-xs font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;