import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.js';
import providerService from '../../services/providerService.js';
import ProviderCard from '../../components/provider/ProviderCard.jsx';
import SkillChip from '../../components/provider/SkillChip.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import { SkeletonCard } from '../../components/common/Spinner.jsx';
import { Search, MapPin, Sparkles, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Featured Providers on startup
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const data = await providerService.getProviders();
        setProviders(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-primary/5 via-[#F8F9FA] to-terracotta/5 rounded-3xl p-6 sm:p-12 border border-border shadow-xs flex flex-col gap-6 items-center text-center max-w-7xl w-full mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-primary/10 text-teal-dark border border-teal-light/20 text-xs font-bold rounded-full select-none uppercase tracking-wide">
          <Sparkles size={12} className="animate-spin duration-3000" />
          Empowering Local Talents
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-textPrimary leading-tight max-w-3xl">
          Hire Trusted Local Skills From Your Neighbourhood
        </h1>
        <p className="text-textSecondary text-base sm:text-lg max-w-2xl leading-relaxed">
          HomeTalent connects skilled homemakers, retirees, and local experts offering tailoring, baking, lessons, and crafts with neighbours seeking reliable help.
        </p>

        {!isAuthenticated && (
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            <Link to="/register">
              <Button className="shadow-md shadow-teal-primary/20">Get Started Today</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Offer Your Skills</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Featured Skill Providers Section */}
      {providers.length > 0 && (
        <section className="mt-12 flex flex-col gap-6 w-full max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-textPrimary border-b border-border pb-3">
            Featured Skill Providers
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider._id} provider={provider} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* How it works Section */}
      <section className="mt-20 border-t border-border pt-16 w-full max-w-7xl mx-auto pb-10">
        <h2 className="text-center text-3xl font-extrabold text-textPrimary">
          How HomeTalent Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-primary/10 text-teal-primary font-bold text-lg font-heading">
              1
            </span>
            <h3 className="font-bold text-textPrimary text-base mt-2">Browse Local Talents</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Explore skills in your area, read bios of skilled homemakers and retirees, and view verified reviews.
            </p>
          </div>
          <div className="bg-white border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-primary/10 text-teal-primary font-bold text-lg font-heading">
              2
            </span>
            <h3 className="font-bold text-textPrimary text-base mt-2">Submit Booking Request</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Pick a service, set your preferred date and budget, write any guidelines, and request a booking.
            </p>
          </div>
          <div className="bg-white border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-3">
            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-primary/10 text-teal-primary font-bold text-lg font-heading">
              3
            </span>
            <h3 className="font-bold text-textPrimary text-base mt-2">Get the Job Done</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Coordinate schedule details directly, get quality hyperlocal work, and write reviews to support local talent.
            </p>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Landing;
