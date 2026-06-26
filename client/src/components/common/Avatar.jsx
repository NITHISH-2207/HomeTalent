import React from 'react';

export const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
  ...props
}) => {
  let sizeStyle = "w-10 h-10";
  switch (size) {
    case 'xs':
      sizeStyle = "w-6 h-6 text-xs";
      break;
    case 'sm':
      sizeStyle = "w-8 h-8 text-sm";
      break;
    case 'lg':
      sizeStyle = "w-16 h-16 text-lg";
      break;
    case 'xl':
      sizeStyle = "w-24 h-24 text-2xl";
      break;
    case 'md':
    default:
      sizeStyle = "w-12 h-12 text-base";
      break;
  }

  // Fallback initial
  const initial = alt ? alt.charAt(0).toUpperCase() : 'U';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-teal-light/20 text-teal-dark font-heading font-semibold border border-teal-light/30 shrink-0 ${sizeStyle} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

export default Avatar;
