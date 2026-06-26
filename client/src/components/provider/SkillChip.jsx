import React from 'react';

export const SkillChip = ({
  skill,
  selected = false,
  onClick,
  className = '',
  ...props
}) => {
  const { name, icon } = skill;

  const baseStyle = "inline-flex items-center px-4 py-2 rounded-full border text-sm font-semibold transition select-none";
  let activeStyle = "";
  
  if (onClick) {
    activeStyle = selected
      ? "bg-teal-primary text-white border-teal-primary cursor-pointer shadow-xs"
      : "bg-white text-textSecondary border-border hover:bg-gray-50 cursor-pointer";
  } else {
    activeStyle = "bg-teal-light/10 text-teal-dark border-teal-light/20 cursor-default";
  }

  return (
    <span
      onClick={onClick}
      className={`${baseStyle} ${activeStyle} ${className}`}
      style={{ minHeight: '40px' }} // chip tappable height
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {name}
    </span>
  );
};

export default SkillChip;
