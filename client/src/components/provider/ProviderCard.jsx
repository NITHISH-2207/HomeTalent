import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';
import Avatar from '../common/Avatar.jsx';
import SkillChip from './SkillChip.jsx';
import { Star, MapPin, BadgeIndianRupee } from 'lucide-react';
import Button from '../common/Button.jsx';

export const ProviderCard = ({
  provider,
  className = '',
  ...props
}) => {
  const {
    _id,
    userId,
    headline,
    skills = [],
    pricing,
    averageRating,
    totalReviews,
    communityVerified
  } = provider;

  return (
    <Card className={`flex flex-col h-full ${className}`} hoverable={true} {...props}>
      {/* Top Section: Avatar & Verified Badge */}
      <div className="flex gap-4 items-start">
        <Avatar src={userId?.profileImage} alt={userId?.name || 'Provider'} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-bold text-textPrimary truncate">
              {userId?.name}
            </h3>
            {communityVerified && (
              <span
                className="bg-teal-primary/10 text-teal-dark border border-teal-light/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full select-none"
                title="Verified member of local community"
              >
                ✓ Verified
              </span>
            )}
          </div>
          
          {/* Location details */}
          <div className="flex items-center gap-1 text-xs text-textSecondary mt-1">
            <MapPin size={14} className="text-teal-primary shrink-0" />
            <span className="truncate">
              {userId?.location?.area ? `${userId.location.area}, ${userId.location.city}` : userId?.location?.city || 'Local Area'}
            </span>
          </div>

          {/* Review metrics */}
          <div className="flex items-center gap-1.5 text-xs text-textSecondary mt-1.5">
            <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-bold text-textPrimary">{averageRating || '0.0'}</span>
            <span>({totalReviews || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Headline / Intro */}
      <p className="text-sm text-textSecondary line-clamp-2 mt-4 font-medium italic">
        "{headline || 'HomeTalent provider ready to help you with local skills.'}"
      </p>

      {/* Skill List (Max 3 for compact preview) */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {skills.slice(0, 3).map((skill) => (
          <SkillChip key={skill._id} skill={skill} />
        ))}
        {skills.length > 3 && (
          <span className="text-xs font-semibold text-textSecondary px-2.5 py-1 bg-gray-50 border border-border rounded-full flex items-center justify-center">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {/* Bottom Section: Pricing & Action */}
      <div className="flex items-center justify-between gap-4 mt-auto pt-5 border-t border-border">
        {/* Pricing tag */}
        <div className="flex flex-col">
          <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">
            Starting Price
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-base font-bold text-textPrimary">
              ₹{pricing?.minPrice || 0}
            </span>
            <span className="text-xs text-textSecondary">
              /{pricing?.unit === 'negotiable' ? 'session' : pricing?.unit || 'hour'}
            </span>
          </div>
        </div>

        {/* View Profile Action button (strictly meets min 48px height UX rule 1 via Button.jsx) */}
        <Link to={`/provider/${_id}`}>
          <Button variant="secondary" className="tap-target-btn px-4 py-2 text-sm">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProviderCard;
