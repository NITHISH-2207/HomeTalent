import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookings from '../../hooks/useBookings.js';
import reviewService from '../../services/reviewService.js';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/common/Avatar.jsx';
import BookingStatusBadge from '../../components/booking/BookingStatusBadge.jsx';
import Modal, { ConfirmationModal } from '../../components/common/Modal.jsx';
import formatDate from '../../utils/formatDate.js';
import { Calendar, CircleDollarSign, Inbox, CalendarRange, ArrowLeft } from 'lucide-react';

export const BookingHistory = () => {
  const navigate = useNavigate();
  const { bookings, loading, error, fetchMyBookings, cancel } = useBookings();

  // Review tracking cache state
  const [reviewedBookings, setReviewedBookings] = useState({});

  // Dialog and details states
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [detailsBooking, setDetailsBooking] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Sync reviewed status from database/localStorage for completed bookings
  useEffect(() => {
    const checkReviews = async () => {
      const completed = bookings.filter(b => b.status === 'completed');
      for (const booking of completed) {
        const key = `reviewed_${booking._id}`;
        if (localStorage.getItem(key) === 'true') {
          setReviewedBookings(prev => ({ ...prev, [booking._id]: true }));
          continue;
        }

        try {
          // Fetch counterparty provider reviews to check if already reviewed
          if (booking.providerId?._id) {
            const reviews = await reviewService.getProviderReviews(booking.providerId._id);
            const hasReviewed = reviews.some(r => r.bookingId === booking._id);
            if (hasReviewed) {
              localStorage.setItem(key, 'true');
              setReviewedBookings(prev => ({ ...prev, [booking._id]: true }));
            }
          }
        } catch (err) {
          console.error('Failed to sync review status:', err);
        }
      }
    };
    if (bookings.length > 0) {
      checkReviews();
    }
  }, [bookings]);

  const handleCancelBooking = (id) => {
    setCancelId(id);
    setShowConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (cancelId) {
      try {
        await cancel(cancelId);
      } catch (err) {
        alert(err.message || 'Cancellation failed.');
      }
    }
  };

  const handleLeaveReview = (booking) => {
    navigate(`/leave-review/${booking._id}`, { state: { booking } });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center bg-white"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              My Booking History
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Track request statuses, cancel pending requests, or leave reviews for completed bookings.
            </p>
          </div>
        </div>

        {/* Loading / Error / List States */}
        {loading && bookings.length === 0 ? (
          <Spinner className="py-20" size="lg" />
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-3 mt-2">
            {bookings.map((booking) => {
              const provider = booking.providerId;
              const providerUser = provider?.userId;
              const isReviewed = reviewedBookings[booking._id] === true;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition duration-150 w-full"
                >
                  {/* Top Row — Provider info & status badge */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={providerUser?.profileImage}
                        alt={providerUser?.name || 'Provider'}
                        size="md"
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-textPrimary leading-tight">
                          {providerUser?.name || 'Local Provider'}
                        </span>
                        <div className="mt-1 flex">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-primary/10 text-teal-dark border border-teal-light/20">
                            {booking.skillId?.name || 'Local Service'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <BookingStatusBadge status={booking.status} className="ml-auto sm:ml-0" />
                  </div>

                  {/* Middle Row — Booking details in a clean horizontal line */}
                  <div className="flex flex-wrap gap-4 items-center text-sm text-textSecondary border-t border-border/40 pt-1 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-textSecondary/80" />
                      <span>{formatDate(booking.preferredDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CircleDollarSign size={16} className="text-textSecondary/80" />
                      <span>Budget: <strong className="text-textPrimary">₹{booking.budget}</strong></span>
                    </div>
                  </div>

                  {/* Bottom Row — Customer message */}
                  {booking.message && (
                    <div className="mt-1 border-t border-border/40 pt-2">
                      <p className="text-xs text-textSecondary italic line-clamp-2 leading-relaxed break-words">
                        "{booking.message}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons row at the bottom of the card */}
                  <div className="flex flex-wrap gap-3 mt-2 border-t border-border pt-4 justify-end min-[400px]:flex-row flex-col w-full">
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline-danger"
                        onClick={() => handleCancelBooking(booking._id)}
                        className="w-full min-[400px]:w-auto"
                      >
                        Cancel Booking
                      </Button>
                    )}

                    {booking.status === 'accepted' && (
                      <Button
                        variant="secondary"
                        onClick={() => setDetailsBooking(booking)}
                        className="w-full min-[400px]:w-auto"
                      >
                        View Details
                      </Button>
                    )}

                    {booking.status === 'completed' && (
                      <div className="flex flex-wrap gap-3 justify-end min-[400px]:flex-row flex-col w-full min-[400px]:w-auto">
                        {!isReviewed ? (
                          <Button
                            variant="primary"
                            onClick={() => handleLeaveReview(booking)}
                            className="w-full min-[400px]:w-auto"
                          >
                            Leave Review
                          </Button>
                        ) : (
                          <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-bold bg-green-50 text-green-700 border border-green-200 w-full min-[400px]:w-auto" style={{ minHeight: '48px' }}>
                            Reviewed
                          </span>
                        )}
                        <Button
                          variant="secondary"
                          onClick={() => setDetailsBooking(booking)}
                          className="w-full min-[400px]:w-auto"
                        >
                          View Details
                        </Button>
                      </div>
                    )}

                    {booking.status === 'cancelled' && (
                      <Button
                        variant="ghost"
                        className="border border-border text-textSecondary hover:bg-gray-50 w-full min-[400px]:w-auto"
                        onClick={() => setDetailsBooking(booking)}
                      >
                        View Details
                      </Button>
                    )}

                    {booking.status === 'rejected' && (
                      <Button
                        variant="ghost"
                        className="border border-border text-textSecondary hover:bg-gray-50 w-full min-[400px]:w-auto"
                        onClick={() => setDetailsBooking(booking)}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-border rounded-2xl p-12 text-center mt-6">
            <Inbox size={48} className="text-textSecondary/30 mx-auto mb-4" />
            <h3 className="text-base font-bold text-textPrimary">No bookings found</h3>
            <p className="text-textSecondary text-sm mt-1 leading-relaxed max-w-sm mx-auto">
              You haven't requested any hyperlocal services yet. Head over to the home page to browse and book.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation portal for cancelling request */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Request?"
        message="Are you sure you want to cancel this booking request? This will retract your request to the provider."
        confirmText="Yes, Cancel"
        isDestructive={true}
      />

      {/* Booking Details Overlay Modal */}
      <Modal
        isOpen={!!detailsBooking}
        onClose={() => setDetailsBooking(null)}
        title="Booking Details"
      >
        {detailsBooking && (
          <div className="flex flex-col gap-4 text-sm text-textPrimary">
            {/* Provider info header */}
            <div className="flex items-center gap-3 bg-gray-50 border border-border p-3.5 rounded-xl">
              <Avatar src={detailsBooking.providerId?.userId?.profileImage} alt={detailsBooking.providerId?.userId?.name || 'Provider'} size="md" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base text-textPrimary">
                  {detailsBooking.providerId?.userId?.name}
                </span>
                <div className="mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-primary/10 text-teal-dark border border-teal-light/20 uppercase tracking-wide">
                    {detailsBooking.skillId?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Spec items list */}
            <div className="flex flex-col gap-2.5 bg-gray-50 border border-border p-3.5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-textSecondary font-medium">Status</span>
                <BookingStatusBadge status={detailsBooking.status} />
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                <span className="text-textSecondary font-medium">Preferred Date</span>
                <span className="font-semibold">{formatDate(detailsBooking.preferredDate)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                <span className="text-textSecondary font-medium">Budget</span>
                <span className="font-semibold text-teal-primary">₹{detailsBooking.budget}</span>
              </div>
              {detailsBooking.providerId?.userId?.location && (
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <span className="text-textSecondary font-medium">Location</span>
                  <span className="font-semibold text-right text-xs">
                    {detailsBooking.providerId?.userId?.location?.area}, {detailsBooking.providerId?.userId?.location?.city}
                  </span>
                </div>
              )}
            </div>

            {/* Guidelines/Message */}
            {detailsBooking.message && (
              <div className="flex flex-col gap-1 bg-gray-50 border border-border p-3.5 rounded-xl">
                <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">
                  Customer Message / Guidelines
                </span>
                <p className="text-textSecondary italic mt-1 leading-relaxed break-words">
                  "{detailsBooking.message}"
                </p>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <Button fullWidth onClick={() => setDetailsBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default BookingHistory;
