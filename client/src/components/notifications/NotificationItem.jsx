import React from 'react';
import { Calendar, CheckCircle2, XCircle, Award, Star } from 'lucide-react';
import formatDate from '../../utils/formatDate.js';

export const NotificationItem = ({
  notification,
  onReadClick,
  ...props
}) => {
  const { _id, title, message, type, isRead, createdAt } = notification;

  // Icon mapping based on type
  const getIcon = () => {
    switch (type) {
      case 'booking_request':
        return <Calendar className="text-amber-500" size={20} />;
      case 'booking_accepted':
        return <CheckCircle2 className="text-teal-primary" size={20} />;
      case 'booking_rejected':
        return <XCircle className="text-error" size={20} />;
      case 'booking_completed':
        return <Award className="text-blue-500" size={20} />;
      case 'new_review':
        return <Star className="text-terracotta fill-terracotta" size={20} />;
      default:
        return <Calendar className="text-textSecondary" size={20} />;
    }
  };

  const getBgColor = () => {
    if (isRead) return 'bg-white hover:bg-gray-50';
    return 'bg-teal-light/5 hover:bg-teal-light/10';
  };

  return (
    <div
      onClick={() => !isRead && onReadClick(_id)}
      className={`flex items-start gap-3 p-4 border-b border-border transition cursor-pointer select-none ${getBgColor()}`}
      {...props}
    >
      {/* Type Icon Container */}
      <div className="p-2 bg-gray-50 rounded-xl border border-border shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Message Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-semibold truncate ${isRead ? 'text-textPrimary' : 'text-teal-dark font-bold'}`}>
            {title}
          </p>
          <span className="text-[10px] text-textSecondary whitespace-nowrap font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <p className="text-xs text-textSecondary leading-relaxed mt-1 break-words">
          {message}
        </p>
      </div>

      {/* Unread dot */}
      {!isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-teal-primary shrink-0 mt-2 animate-pulse" />
      )}
    </div>
  );
};

export default NotificationItem;
