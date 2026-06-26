import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-border rounded-2xl p-6 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:translate-y-[-2px]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
