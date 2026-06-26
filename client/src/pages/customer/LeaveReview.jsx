import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import reviewService from '../../services/reviewService.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import { Star, ArrowLeft, Heart } from 'lucide-react';

export const LeaveReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Load cache from state if available
  const booking = location.state?.booking || {};
  const providerName = booking?.providerId?.userId?.name || 'Local Provider';
  const skillName = booking?.skillId?.name || 'Service';

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await reviewService.leaveReview({
        bookingId,
        rating,
        comment
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings'); // Go back to bookings after submission
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Review submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
        {/* Header link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-heading font-bold text-lg text-textPrimary">Leave feedback</span>
        </div>

        <Card hoverable={false} className="border border-border">
          {success ? (
            <div className="text-center py-6 flex flex-col items-center gap-3.5 animate-fade-in">
              <Heart className="text-terracotta fill-terracotta animate-pulse" size={48} />
              <h2 className="font-heading font-bold text-lg text-textPrimary">Feedback Submitted!</h2>
              <p className="text-textSecondary text-sm leading-relaxed px-4">
                Thank you for reviewing! Your feedback helps our community of local homemakers and retirees grow.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="font-heading font-bold text-base text-textPrimary">
                  Share Your Experience
                </h3>
                <p className="text-xs text-textSecondary mt-0.5">
                  Reviewing <strong>{providerName}</strong> for <strong>{skillName}</strong>.
                </p>
              </div>

              {/* Clickable Star Rating Grid (Big targets >= 48px) */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-medium text-textPrimary text-sm">
                  Service Rating <span className="text-error">*</span>
                </label>
                <div className="flex justify-between items-center bg-gray-50 border border-border rounded-xl p-4 mt-1">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const isLit = starNum <= (hoverRating || rating);
                    return (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setRating(starNum)}
                        onMouseEnter={() => setHoverRating(starNum)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-2 transition-transform duration-100 hover:scale-110 flex items-center justify-center"
                        style={{ minWidth: '48px', minHeight: '48px' }} // UX tap target
                        title={`${starNum} Stars`}
                      >
                        <Star
                          size={32}
                          className={`transition ${
                            isLit ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text area */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="comment" className="font-heading font-medium text-textPrimary text-sm">
                  Write Comment / Feedback
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  placeholder="Tell others what was great, or anything that could be improved..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {error && <p className="text-error text-sm font-semibold">{error}</p>}

              <Button type="submit" disabled={loading} fullWidth className="mt-2">
                {loading ? 'Submitting Review...' : 'Submit Feedback'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

export default LeaveReview;
export { default as BookingHistory } from './BookingHistory.jsx';
