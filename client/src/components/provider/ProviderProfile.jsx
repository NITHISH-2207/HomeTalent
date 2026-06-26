import React from 'react';
import SkillChip from './SkillChip.jsx';
import ReviewCard from './ReviewCard.jsx';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import { Star, MapPin, BadgeIndianRupee, Calendar, Image as ImageIcon } from 'lucide-react';
import { DAYS_OF_WEEK } from '../../utils/constants.js';

export const ProviderProfile = ({
  provider,
  reviews = [],
  onBookClick,
  showBookButton = true,
  ...props
}) => {
  const {
    userId,
    headline,
    bio,
    skills = [],
    availability = {},
    pricing = {},
    portfolioImages = [],
    averageRating,
    totalReviews,
    communityVerified
  } = provider;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full" {...props}>
      
      {/* Left 2 Columns: Bio, Skills, Portfolio, Reviews */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Main Header Information Card */}
        <Card hoverable={false} className="flex flex-col gap-5 border border-border">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
            <Avatar src={userId?.profileImage} alt={userId?.name || 'Provider'} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-textPrimary leading-snug">
                  {userId?.name}
                </h1>
                {communityVerified && (
                  <span className="bg-teal-primary/10 text-teal-dark border border-teal-light/20 text-xs font-bold px-2 py-0.5 rounded-full select-none">
                    ✓ Community Verified
                  </span>
                )}
              </div>

              {/* Location pin */}
              <div className="flex items-center gap-1.5 text-sm text-textSecondary mt-1.5">
                <MapPin size={16} className="text-teal-primary shrink-0" />
                <span>
                  {userId?.location?.area ? `${userId.location.area}, ${userId.location.city}` : userId?.location?.city || 'Local Area'}
                </span>
              </div>

              {/* Star score */}
              <div className="flex items-center gap-1.5 text-sm text-textSecondary mt-2">
                <Star size={16} className="text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-bold text-textPrimary text-base">{averageRating || '0.0'}</span>
                <span>({totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Headline block */}
          {headline && (
            <div className="p-4 bg-gray-50 border border-border rounded-xl">
              <p className="text-base text-textPrimary font-semibold italic">
                "{headline}"
              </p>
            </div>
          )}

          {/* Detailed Biography */}
          <div className="flex flex-col gap-2 mt-2">
            <h3 className="font-heading font-bold text-base text-textPrimary">About Me</h3>
            <p className="text-textSecondary text-base leading-relaxed whitespace-pre-wrap">
              {bio || 'No detailed biography provided yet.'}
            </p>
          </div>
        </Card>

        {/* Skill Tags Card */}
        <Card hoverable={false} className="border border-border">
          <h3 className="font-heading font-bold text-base text-textPrimary mb-4">Skills Offered</h3>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <SkillChip key={skill._id} skill={skill} />
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-textSecondary italic">No skills listed.</p>
            )}
          </div>
        </Card>

        {/* Portfolio Showcase Images Card */}
        <Card hoverable={false} className="border border-border">
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
            <ImageIcon size={20} className="text-teal-primary" />
            <h3 className="font-heading font-bold text-base text-textPrimary">Portfolio Showcase</h3>
          </div>
          {portfolioImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolioImages.map((imgUrl, idx) => {
                // Ensure image works locally or with absolute host
                const fullUrl = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`;
                return (
                  <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-border bg-gray-50 group hover:shadow transition duration-200">
                    <img
                      src={fullUrl}
                      alt={`Portfolio item ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-border">
              <ImageIcon size={32} className="text-textSecondary/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-textPrimary">No portfolio images uploaded</p>
              <p className="text-xs text-textSecondary mt-0.5">Images showcasing work will appear here.</p>
            </div>
          )}
        </Card>

        {/* Customer Reviews List Card */}
        <div className="flex flex-col gap-4">
          <h3 className="font-heading font-bold text-lg text-textPrimary">Reviews & Feedback</h3>
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            ) : (
              <div className="bg-white border border-border rounded-2xl p-8 text-center">
                <Star size={32} className="text-textSecondary/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-textPrimary">No reviews yet</p>
                <p className="text-xs text-textSecondary mt-0.5">Be the first to hire and review this provider!</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Pricing, Availability switches, Booking CTA */}
      <div className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
        
        {/* Reservation / Transaction Panel */}
        <Card hoverable={false} className="border border-teal-primary/30 bg-white shadow-md flex flex-col gap-5">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading font-bold text-lg text-textPrimary">Service Details</h3>
          </div>

          {/* Pricing indicator */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
              Pricing Details
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-textPrimary">
                ₹{pricing?.minPrice || 0} - ₹{pricing?.maxPrice || 0}
              </span>
              <span className="text-sm text-textSecondary">
                /{pricing?.unit || 'session'}
              </span>
            </div>
          </div>

          {/* Availability Switches - Read Only Toggle Visuals (Strict UX Rule 6) */}
          <div className="flex flex-col gap-2.5 mt-2">
            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest flex items-center gap-1">
              <Calendar size={14} className="text-teal-primary" />
              Weekly Availability
            </span>
            <div className="flex flex-col gap-2 mt-1 bg-gray-50 border border-border p-3.5 rounded-xl">
              {DAYS_OF_WEEK.map((day) => {
                const isAvailable = availability[day.key] === true;
                return (
                  <div key={day.key} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-textPrimary">{day.label}</span>
                    {/* Read-Only toggle switch visual */}
                    <div
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-default rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        isAvailable ? 'bg-teal-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isAvailable ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Call to Action Button */}
          {showBookButton && onBookClick && (
            <Button
              onClick={onBookClick}
              fullWidth
              className="tap-target-btn mt-3 shadow-lg hover:shadow-xl shadow-teal-primary/20"
            >
              Book Now
            </Button>
          )}
        </Card>

      </div>
    </div>
  );
};

export default ProviderProfile;
export { default as ProviderCard } from './ProviderCard.jsx';
export { default as SkillChip } from './SkillChip.jsx';
export { default as ReviewCard } from './ReviewCard.jsx';
