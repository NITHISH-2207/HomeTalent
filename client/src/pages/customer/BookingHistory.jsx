import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookings from '../../hooks/useBookings.js';
import BookingCard from '../../components/booking/BookingCard.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { CalendarRange, Inbox } from 'lucide-react';

export const BookingHistory = () => {
  const navigate = useNavigate();
  const { bookings, loading, error, fetchMyBookings, cancel } = useBookings();

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelBooking = async (id) => {
    try {
      await cancel(id);
    } catch (err) {
      alert(err.message || 'Cancellation failed.');
    }
  };

  const handleLeaveReview = (booking) => {
    // Navigate to LeaveReview page with booking details
    navigate(`/leave-review/${booking._id}`, { state: { booking } });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <CalendarRange size={24} className="text-teal-primary" />
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              My Booking History
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Track request statuses, cancel pending requests, or leave reviews for completed bookings.
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && bookings.length === 0 ? (
          <Spinner className="py-20" size="lg" />
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-5 mt-2">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                mode="customer"
                onCancel={handleCancelBooking}
                onLeaveReview={handleLeaveReview}
              />
            ))}
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
    </PageWrapper>
  );
};

export default BookingHistory;
