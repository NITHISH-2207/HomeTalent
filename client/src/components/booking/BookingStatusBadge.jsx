import React from 'react';
import getStatusColors from '../../utils/statusColors.js';

export const BookingStatusBadge = ({
  status = 'pending',
  className = '',
  ...props
}) => {
  const colors = getStatusColors(status);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-transparent ${colors.badge} ${className}`}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {status}
    </span>
  );
};

export default BookingStatusBadge;
