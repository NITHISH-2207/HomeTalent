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
  
  const [skills, setSkills] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [areaQuery, setAreaQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Fetch Skills and Providers on startup
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const skillsList = await providerService.getSkills();
        setSkills(skillsList);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch Providers whenever filters change
  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedSkill) filters.skill = selectedSkill;
      if (cityQuery) filters.city = cityQuery;
      if (areaQuery) filters.area = areaQuery;
      if (searchQuery) filters.search = searchQuery;

      const data = await providerService.getProviders(filters);
      setProviders(data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [selectedSkill, cityQuery, areaQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProviderData();
  };

  const clearFilters = () => {
    setSelectedSkill('');
    setSearchQuery('');
    setCityQuery('');
    setAreaQuery('');
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-primary/5 via-[#FAF8F5] to-terracotta/5 rounded-3xl p-6 sm:p-12 border border-border shadow-xs flex flex-col gap-6 items-center text-center max-w-7xl w-full mx-auto">
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

      {/* Main Browse Section */}
      <section className="mt-12 flex flex-col gap-8 w-full max-w-7xl mx-auto">
        
        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white border border-border p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-textSecondary shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search provider name, city, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-lg text-base text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition"
                style={{ minHeight: '48px', fontSize: '16px' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">
              Filter by City
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-base text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition"
              style={{ minHeight: '48px', fontSize: '16px' }}
            />
          </div>

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </form>

        {/* Skill Filter Chips Section (Strict UX Rule 5: Chips ONLY) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-bold text-textPrimary">
              Browse by Skills
            </h2>
            {(selectedSkill || searchQuery || cityQuery || areaQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:underline transition"
              >
                <FilterX size={16} />
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2.5 mt-1 bg-white border border-border p-4 rounded-2xl shadow-xs">
            {skills.map((skill) => {
              const isSelected = selectedSkill === skill._id;
              return (
                <SkillChip
                  key={skill._id}
                  skill={skill}
                  selected={isSelected}
                  onClick={() => setSelectedSkill(isSelected ? '' : skill._id)}
                />
              );
            })}
          </div>
        </div>

        {/* Provider Grid */}
        <div className="flex flex-col gap-6 mt-2">
          <h2 className="text-2xl font-bold text-textPrimary border-b border-border pb-3">
            Available Skill Providers
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider._id} provider={provider} />
              ))}
            </div>
          ) : (
            /* Friendly Empty State as per UX Rule 8 */
            <div className="bg-white border border-border border-dashed rounded-3xl p-12 text-center max-w-xl mx-auto w-full">
              <FilterX size={48} className="text-textSecondary/40 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-textPrimary">No providers found</h3>
              <p className="text-textSecondary text-sm mt-1 leading-relaxed">
                We couldn't find any skill providers matching your search. Try resetting your filters or adjusting locations.
              </p>
              <Button onClick={clearFilters} variant="secondary" className="mt-5 mx-auto">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

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
