import React from 'react';
import Avatar from '../common/Avatar.jsx';
import formatDate from '../../utils/formatDate.js';
import { Star } from 'lucide-react';

export const ReviewCard = ({
  review,
  className = '',
  ...props
}) => {
  const { customerId, rating, comment, createdAt } = review;

  // Build star indicators array
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
      />
    ));
  };

  return (
    <div className={`p-5 bg-white border border-border rounded-2xl shadow-xs ${className}`} {...props}>
      <div className="flex items-start justify-between gap-4">
        {/* Customer Profile & Info */}
        <div className="flex items-center gap-3">
          <Avatar src={customerId?.profileImage} alt={customerId?.name || 'User'} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-textPrimary leading-tight">
              {customerId?.name || 'Local Customer'}
            </span>
            <span className="text-xs text-textSecondary">
              {customerId?.location?.area ? `${customerId.location.area}, ${customerId.location.city}` : customerId?.location?.city || 'Verified User'}
            </span>
          </div>
        </div>

        {/* Date */}
        <span className="text-xs text-textSecondary">
          {formatDate(createdAt)}
        </span>
      </div>

      {/* Star Ratings */}
      <div className="flex gap-1 mt-3">
        {renderStars()}
      </div>

      {/* Review Comment */}
      {comment && (
        <p className="text-sm text-textPrimary leading-relaxed mt-2.5 italic">
          "{comment}"
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
