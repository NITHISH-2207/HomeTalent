import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import providerService from '../../services/providerService.js';
import reviewService from '../../services/reviewService.js';
import bookingService from '../../services/bookingService.js';
import ProviderProfile from '../../components/provider/ProviderProfile.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Modal from '../../components/common/Modal.jsx';
import BookingForm from '../../components/booking/BookingForm.jsx';
import Button from '../../components/common/Button.jsx';
import { ArrowLeft, MessageSquareWarning } from 'lucide-react';

export const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchProviderDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const profileData = await providerService.getProviderById(id);
        setProvider(profileData);

        // Fetch reviews
        const reviewsData = await reviewService.getProviderReviews(profileData._id);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProviderDetail();
  }, [id]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsBookModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    setBookingLoading(true);
    try {
      await bookingService.createBooking({
        providerId: provider._id,
        ...bookingData
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setIsBookModalOpen(false);
        setBookingSuccess(false);
        navigate('/bookings'); // Go to booking history to track
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        {/* Back Link Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">
              Hyperlocal Skill Marketplace
            </span>
            <h2 className="text-xl font-bold text-textPrimary leading-tight mt-0.5">
              Provider Profile Details
            </h2>
          </div>
        </div>

        {loading ? (
          <Spinner className="py-24" size="lg" />
        ) : error ? (
          <div className="bg-white border border-border rounded-2xl p-8 text-center max-w-md mx-auto mt-8 flex flex-col gap-4">
            <MessageSquareWarning size={40} className="text-error mx-auto" />
            <p className="text-textSecondary text-sm font-semibold">{error}</p>
            <Button onClick={() => navigate('/')}>Back to Browse</Button>
          </div>
        ) : provider ? (
          <>
            <ProviderProfile
              provider={provider}
              reviews={reviews}
              onBookClick={handleBookClick}
              showBookButton={user?._id !== provider.userId?._id} // Hide booking if viewing oneself
            />

            {/* Booking Modal */}
            <Modal
              isOpen={isBookModalOpen}
              onClose={() => !bookingLoading && setIsBookModalOpen(false)}
              title={`Book ${provider.userId?.name}`}
            >
              {bookingSuccess ? (
                <div className="text-center py-6 flex flex-col gap-3 items-center animate-fade-in">
                  <span className="text-4xl">🎉</span>
                  <p className="font-heading font-bold text-lg text-textPrimary">Request Sent Successfully!</p>
                  <p className="text-textSecondary text-sm">
                    We notified the provider. Redirecting to bookings...
                  </p>
                </div>
              ) : (
                <BookingForm
                  skills={provider.skills}
                  onSubmit={handleBookingSubmit}
                  loading={bookingLoading}
                />
              )}
            </Modal>
          </>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default ProviderDetail;
export { default as BrowseSkills } from './BrowseSkills.jsx';
export { default as Home } from './Home.jsx';
