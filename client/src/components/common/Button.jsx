import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = "flex items-center justify-center font-heading font-medium rounded-xl transition duration-200 tap-target-btn px-6 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-base";
  
  let variantStyle = "";
  switch (variant) {
    case 'secondary':
      variantStyle = "bg-white text-teal-primary border-teal-primary hover:bg-teal-50";
      break;
    case 'danger':
      variantStyle = "bg-error text-white border-error hover:bg-red-650";
      break;
    case 'outline-danger':
      variantStyle = "bg-white text-error border-error hover:bg-red-50";
      break;
    case 'ghost':
      variantStyle = "bg-transparent text-textSecondary border-transparent hover:bg-gray-100";
      break;
    case 'primary':
    default:
      variantStyle = "bg-teal-primary text-white border-teal-primary hover:bg-teal-dark";
      break;
  }

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${className}`}
      style={{ minHeight: '48px' }} // Strict UX rule: minimum tap target 48px
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
