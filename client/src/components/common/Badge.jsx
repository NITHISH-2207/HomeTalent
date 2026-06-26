import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  let variantStyle = "";
  switch (variant) {
    case 'success':
      variantStyle = "bg-green-150 text-success border-green-200";
      break;
    case 'warning':
      variantStyle = "bg-amber-100 text-warning border-amber-200";
      break;
    case 'error':
    case 'danger':
      variantStyle = "bg-red-100 text-error border-red-200";
      break;
    case 'info':
      variantStyle = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case 'primary':
      variantStyle = "bg-teal-light/20 text-teal-dark border-teal-light/35";
      break;
    case 'default':
    default:
      variantStyle = "bg-gray-100 text-textSecondary border-gray-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
