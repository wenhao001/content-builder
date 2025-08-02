import React from 'react';
import classNames from 'classnames';

/**
 * Textarea variants
 */
type TextareaVariant = 'default' | 'secondary' | 'destructive';

/**
 * Textarea sizes
 */
type TextareaSize = 'sm' | 'md' | 'lg';

/**
 * Textarea component props
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * The variant of the textarea
   * @default 'default'
   */
  variant?: TextareaVariant;
  /**
   * The size of the textarea
   * @default 'md'
   */
  size?: TextareaSize;
  /**
   * Whether the textarea is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the textarea has an error
   * @default false
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The label for the textarea
   */
  label?: string;
  /**
   * The ID for the textarea (used for label association)
   */
  id?: string;
  /**
   * Whether the textarea should auto-resize
   * @default false
   */
  autoResize?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

const Textarea: React.FC<TextareaProps> = (
  {
    variant = 'default',
    size = 'md',
    disabled = false,
    error = false,
    errorMessage,
    label,
    id,
    autoResize = false,
    className,
    rows = 4,
    ...props
  }
) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // Handle auto-resize functionality
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      // Reset height to calculate scroll height accurately
      textareaRef.current.style.height = 'auto';
      // Set height based on content
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [autoResize, props.value, props.defaultValue]);

  // Base textarea classes
  const baseClasses = 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none';

  // Variant classes
  const variantClasses = {
    default: '',
    secondary: 'bg-muted',
    destructive: error ? 'border-destructive focus-visible:ring-destructive' : '',
  }[variant];

  // Size classes
  const sizeClasses = {
    sm: 'min-h-[60px] text-xs',
    md: 'min-h-[80px] text-sm',
    lg: 'min-h-[120px] text-base',
  }[size];

  // Auto-resize class
  const autoResizeClass = autoResize ? 'h-auto' : '';

  // Combine all textarea classes
  const textareaClasses = classNames(
    baseClasses,
    variantClasses,
    sizeClasses,
    autoResizeClass,
    className
  );

  return (
    <div className="textarea-wrapper space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={textareaRef}
        rows={autoResize ? 1 : rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-xs font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Textarea;