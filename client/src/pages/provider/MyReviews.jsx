import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.js';
import providerService from '../../services/providerService.js';
import reviewService from '../../services/reviewService.js';
import ReviewCard from '../../components/provider/ReviewCard.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { Star, MessageSquare } from 'lucide-react';

export const MyReviews = () => {
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Load provider profile first to find profile _id
        const profileData = await providerService.getProviderById(user._id);
        setProfile(profileData);

        // Fetch reviews using providerProfile _id
        const reviewsData = await reviewService.getProviderReviews(profileData._id);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <MessageSquare size={24} className="text-teal-primary" />
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              Customer Feedback & Reviews
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Read feedback and testimonials submitted by clients who booked your services.
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner className="py-20" size="lg" />
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-2">
            {/* Rating Summary Card */}
            {profile && (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-6">
                <div className="flex flex-col items-center justify-center bg-teal-light/5 border border-teal-light/20 rounded-xl p-4 w-28 text-center">
                  <span className="text-3xl font-extrabold text-teal-dark">{profile.averageRating || '0.0'}</span>
                  <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider mt-1">Average</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-base font-bold text-textPrimary">
                    <Star size={18} className="text-amber-400 fill-amber-400 shrink-0" />
                    <span>Total Rating Score</span>
                  </div>
                  <p className="text-sm text-textSecondary mt-1 leading-relaxed">
                    Based on {profile.totalReviews || 0} reviews from clients in Bandra & Khar.
                  </p>
                </div>
              </div>
            )}

            {/* List feed */}
            <div className="flex flex-col gap-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              ) : (
                <div className="bg-white border border-border rounded-2xl p-12 text-center">
                  <Star size={48} className="text-textSecondary/30 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-textPrimary">No reviews received</h3>
                  <p className="text-textSecondary text-sm mt-1 leading-relaxed max-w-sm mx-auto">
                    Reviews from customers will appear here after they review your completed bookings.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default MyReviews;
export { default as BookingRequests } from './BookingRequests.jsx';
export { default as EditProfile } from './EditProfile.jsx';
export { default as Dashboard } from './Dashboard.jsx';
