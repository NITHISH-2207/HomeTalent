import React, { useState, useEffect } from 'react';
import useBookings from '../../hooks/useBookings.js';
import BookingCard from '../../components/booking/BookingCard.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { CalendarRange, Inbox } from 'lucide-react';

export const BookingRequests = () => {
  const { requests, loading, error, fetchRequests, accept, reject, complete } = useBookings();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'accepted' | 'history'

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (id) => {
    try {
      await accept(id);
    } catch (err) {
      alert(err.message || 'Failed to accept request.');
    }
  };

  const handleReject = async (id) => {
    try {
      await reject(id);
    } catch (err) {
      alert(err.message || 'Failed to reject request.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await complete(id);
    } catch (err) {
      alert(err.message || 'Failed to complete request.');
    }
  };

  // Filter requests based on current active tab
  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'accepted':
        return requests.filter(r => r.status === 'accepted');
      case 'history':
        return requests.filter(r => ['completed', 'rejected', 'cancelled'].includes(r.status));
      case 'pending':
      default:
        return requests.filter(r => r.status === 'pending');
    }
  };

  const filtered = getFilteredRequests();

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <CalendarRange size={24} className="text-teal-primary" />
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              Manage Booking Requests
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Review incoming service jobs, update schedules, or mark completed bookings.
            </p>
          </div>
        </div>

        {/* Tab Controls (Min 48px height tap target rule 1) */}
        <div className="flex border-b border-border bg-white rounded-xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 font-heading text-sm font-semibold rounded-lg py-3 transition ${
              activeTab === 'pending'
                ? 'bg-teal-primary text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
            }`}
            style={{ minHeight: '48px' }}
          >
            Pending Requests ({requests.filter(r => r.status === 'pending').length})
          </button>
          
          <button
            onClick={() => setActiveTab('accepted')}
            className={`flex-1 font-heading text-sm font-semibold rounded-lg py-3 transition ${
              activeTab === 'accepted'
                ? 'bg-teal-primary text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
            }`}
            style={{ minHeight: '48px' }}
          >
            Active Jobs ({requests.filter(r => r.status === 'accepted').length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 font-heading text-sm font-semibold rounded-lg py-3 transition ${
              activeTab === 'history'
                ? 'bg-teal-primary text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
            }`}
            style={{ minHeight: '48px' }}
          >
            History ({requests.filter(r => ['completed', 'rejected', 'cancelled'].includes(r.status)).length})
          </button>
        </div>

        {/* Requests List */}
        {loading && requests.length === 0 ? (
          <Spinner className="py-20" size="lg" />
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-5 mt-2 animate-fade-in">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                mode="provider"
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))}
          </div>
        ) : (
          /* Empty tab states as per UX Rule 8 */
          <div className="bg-white border border-border rounded-2xl p-12 text-center mt-4">
            <Inbox size={48} className="text-textSecondary/30 mx-auto mb-4" />
            <h3 className="text-base font-bold text-textPrimary">
              No {activeTab} bookings
            </h3>
            <p className="text-textSecondary text-sm mt-1 leading-relaxed max-w-sm mx-auto">
              {activeTab === 'pending'
                ? 'You have no pending requests at this time. Available requests will appear here.'
                : activeTab === 'accepted'
                ? "No active projects. Click the 'Pending Requests' tab to check for incoming offers."
                : 'Your booking request history is currently empty.'}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BookingRequests;
