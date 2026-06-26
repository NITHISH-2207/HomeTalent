import React from 'react';

export const Spinner = ({
  size = 'md',
  className = '',
  ...props
}) => {
  let sizeStyle = "w-6 h-6";
  switch (size) {
    case 'sm':
      sizeStyle = "w-4 h-4";
      break;
    case 'lg':
      sizeStyle = "w-10 h-10";
      break;
    case 'xl':
      sizeStyle = "w-16 h-16";
      break;
    case 'md':
    default:
      sizeStyle = "w-8 h-8";
      break;
  }

  return (
    <div className={`flex items-center justify-center p-2 ${className}`} {...props}>
      <svg
        className={`animate-spin text-teal-primary ${sizeStyle}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          document="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default Spinner;
// Friendly skeleton loading fallback helper
export const SkeletonCard = () => (
  <div className="bg-white border border-border rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);
