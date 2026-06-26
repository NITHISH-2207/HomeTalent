import React, { useState } from 'react';
import BookingStatusBadge from './BookingStatusBadge.jsx';
import Button from '../common/Button.jsx';
import Avatar from '../common/Avatar.jsx';
import Card from '../common/Card.jsx';
import formatDate from '../../utils/formatDate.js';
import { Calendar, CircleDollarSign, MessageSquare, Star } from 'lucide-react';
import { ConfirmationModal } from '../common/Modal.jsx';

export const BookingCard = ({
  booking,
  mode = 'customer',
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onLeaveReview,
  ...props
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'cancel' | 'reject'
  const [confirmConfig, setConfirmConfig] = useState({});

  const {
    _id,
    customerId,
    providerId,
    skillId,
    message,
    preferredDate,
    budget,
    status,
    createdAt
  } = booking;

  // Handle destructive cancellation or rejection confirmation triggers
  const triggerCancelConfirm = () => {
    setConfirmAction('cancel');
    setConfirmConfig({
      title: 'Cancel Booking Request?',
      message: 'Are you sure you want to cancel this booking request? This will retract your request to the provider.',
      confirmText: 'Yes, Cancel'
    });
    setShowConfirm(true);
  };

  const triggerRejectConfirm = () => {
    setConfirmAction('reject');
    setConfirmConfig({
      title: 'Reject Booking Request?',
      message: 'Are you sure you want to reject this incoming booking request? This will notify the customer.',
      confirmText: 'Yes, Reject'
    });
    setShowConfirm(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'cancel' && onCancel) {
      onCancel(_id);
    } else if (confirmAction === 'reject' && onReject) {
      onReject(_id);
    }
  };

  // Render info for counterparty
  const oppositeUser = mode === 'customer' ? providerId?.userId : customerId;
  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';
  const isCompleted = status === 'completed';

  return (
    <Card hoverable={false} className="flex flex-col gap-4 border border-border w-full" {...props}>
      {/* Card Header: Counterparty Info & Status Badge */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <Avatar src={oppositeUser?.profileImage} alt={oppositeUser?.name || 'User'} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-textPrimary leading-tight">
              {oppositeUser?.name || 'Test User'}
            </span>
            <span className="text-xs text-textSecondary">
              {oppositeUser?.location ? `${oppositeUser.location.area}, ${oppositeUser.location.city}` : 'No location specified'}
            </span>
          </div>
        </div>
        <BookingStatusBadge status={status} />
      </div>

      {/* Card Body: Skill name & specifications */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0" role="img" aria-label="skill icon">
            {skillId?.icon || '🛠'}
          </span>
          <span className="text-base font-bold text-textPrimary">
            {skillId?.name || 'Local Service'}
          </span>
        </div>

        {/* Date and Budget grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-textSecondary mt-1">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-teal-primary" />
            <span>Date: <strong className="text-textPrimary">{formatDate(preferredDate)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={16} className="text-teal-primary" />
            <span>Budget: <strong className="text-textPrimary">₹{budget}</strong></span>
          </div>
        </div>

        {/* Custom request message */}
        {message && (
          <div className="flex gap-2 p-3 bg-gray-50 border border-border rounded-lg text-sm mt-1">
            <MessageSquare size={16} className="text-textSecondary shrink-0 mt-0.5" />
            <p className="text-textSecondary italic break-words flex-1">"{message}"</p>
          </div>
        )}
      </div>

      {/* Card Footer: Role-based Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end border-t border-border pt-4 mt-1">
        {mode === 'customer' && (
          <>
            {isPending && onCancel && (
              <Button
                variant="outline-danger"
                onClick={triggerCancelConfirm}
                className="tap-target-btn w-full sm:w-auto"
              >
                Cancel Request
              </Button>
            )}
            {isCompleted && onLeaveReview && (
              <Button
                variant="primary"
                onClick={() => onLeaveReview(booking)}
                className="tap-target-btn w-full sm:w-auto flex items-center gap-1.5"
              >
                <Star size={16} />
                Leave a Review
              </Button>
            )}
          </>
        )}

        {mode === 'provider' && (
          <>
            {isPending && (
              <div className="flex gap-3 w-full sm:w-auto">
                {onReject && (
                  <Button
                    variant="outline-danger"
                    onClick={triggerRejectConfirm}
                    className="tap-target-btn flex-1 sm:flex-initial"
                  >
                    Reject
                  </Button>
                )}
                {onAccept && (
                  <Button
                    variant="primary"
                    onClick={() => onAccept(_id)}
                    className="tap-target-btn flex-1 sm:flex-initial"
                  >
                    Accept
                  </Button>
                )}
              </div>
            )}
            {isAccepted && onComplete && (
              <Button
                variant="primary"
                onClick={() => onComplete(_id)}
                className="tap-target-btn w-full sm:w-auto"
              >
                Mark as Completed
              </Button>
            )}
          </>
        )}
      </div>

      {/* Destruction confirmation portal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDestructive={true}
      />
    </Card>
  );
};

export default BookingCard;
