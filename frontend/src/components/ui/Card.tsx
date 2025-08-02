import React from 'react';
import classNames from 'classnames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the card should have a border
   * @default true
   */
  bordered?: boolean;
  /**
   * Whether the card should have a shadow
   * @default true
   */
  shadow?: boolean;
  /**
   * The size of the card
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * The header content of the card
   */
  header?: React.ReactNode;
  /**
   * The footer content of the card
   */
  footer?: React.ReactNode;
  /**
   * The body content of the card
   */
  children?: React.ReactNode;
  /**
   * Additional class names for the card
   */
  className?: string;
  /**
   * Additional class names for the card header
   */
  headerClassName?: string;
  /**
   * Additional class names for the card body
   */
  bodyClassName?: string;
  /**
   * Additional class names for the card footer
   */
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  bordered = true,
  shadow = true,
  size = 'md',
  header,
  footer,
  children,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  ...props
}) => {
  // Base card classes
  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200';

  // Border classes
  const borderClasses = bordered ? 'border border-border' : '';

  // Shadow classes
  const shadowClasses = shadow
    ? 'shadow-sm hover:shadow-md' 
    : '';

  // Size classes
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }[size];

  // Combine all card classes
  const cardClasses = classNames(
    baseClasses,
    borderClasses,
    shadowClasses,
    sizeClasses,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {header && (
        <div className={classNames('card-header pb-4', headerClassName)}>
          {header}
        </div>
      )}
      <div className={classNames('card-body', header ? 'pt-0' : '', bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className={classNames('card-footer pt-4 mt-4 border-t border-border', footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Card.Header component for more flexible header composition
Card.Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={classNames('card-header pb-4', className)}>
    {children}
  </div>
);

// Card.Footer component for more flexible footer composition
Card.Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={classNames('card-footer pt-4 mt-4 border-t border-border', className)}>
    {children}
  </div>
);

// Card.Title component for card headers
Card.Title = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={classNames('text-lg font-semibold', className)}>
    {children}
  </h3>
);

// Card.Description component for card headers
Card.Description = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={classNames('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

export default Card;