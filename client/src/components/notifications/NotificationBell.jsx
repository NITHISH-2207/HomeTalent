import React, { useState, useEffect, useRef } from 'react';
import useNotifications from '../../hooks/useNotifications.js';
import NotificationItem from './NotificationItem.jsx';
import { Bell, CheckSquare } from 'lucide-react';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markNotificationRead, markNotificationsAllRead } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleReadClick = (id) => {
    markNotificationRead(id);
  };

  const handleMarkAll = (e) => {
    e.stopPropagation();
    markNotificationsAllRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2.5 text-textSecondary hover:text-teal-primary hover:bg-gray-50 rounded-xl transition duration-200 tap-target-btn flex items-center justify-center border border-transparent hover:border-border"
        style={{ minHeight: '48px', minWidth: '48px' }}
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-white bg-error transform translate-x-1/3 -translate-y-1/3">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in max-h-[480px] flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-border">
            <span className="font-heading font-bold text-sm text-textPrimary">
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-teal-primary hover:text-teal-dark font-semibold transition"
              >
                <CheckSquare size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* Panel Items */}
          <div className="overflow-y-auto flex-1 divide-y divide-border">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif._id}
                  notification={notif}
                  onReadClick={handleReadClick}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white">
                <Bell size={36} className="text-textSecondary/40 mb-2" />
                <p className="text-sm font-semibold text-textPrimary">All caught up!</p>
                <p className="text-xs text-textSecondary mt-0.5">
                  No new notifications at this time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
// Exporting dummy component matching folder structure
export { default as NotificationItem } from './NotificationItem.jsx';
