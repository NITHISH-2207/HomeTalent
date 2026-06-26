import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import providerService from '../../services/providerService.js';
import Button from '../../components/common/Button.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner, { SkeletonCard } from '../../components/common/Spinner.jsx';
import ProviderCard from '../../components/provider/ProviderCard.jsx';
import { ArrowLeft, Search, MapPin, FilterX } from 'lucide-react';

export const BrowseSkills = () => {
  const navigate = useNavigate();

  // Skills master list
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // Filter States
  const [keywordInput, setKeywordInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Providers list
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  // Fetch all skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await providerService.getSkills();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Fetch providers when filters change
  useEffect(() => {
    const fetchProviders = async () => {
      setProvidersLoading(true);
      try {
        const filters = {};
        if (selectedSkill) filters.skill = selectedSkill;
        if (searchCity) filters.city = searchCity;
        if (searchKeyword) filters.keyword = searchKeyword;

        const data = await providerService.getProviders(filters);
        setProviders(data);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setProvidersLoading(false);
      }
    };
    fetchProviders();
  }, [selectedSkill, searchKeyword, searchCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchKeyword(keywordInput);
    setSearchCity(cityInput);
  };

  const handleClearFilters = () => {
    setKeywordInput('');
    setCityInput('');
    setSearchKeyword('');
    setSearchCity('');
    setSelectedSkill('');
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center bg-white"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              Browse Services
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Find and filter local skill providers from your neighborhood.
            </p>
          </div>
        </div>

        {/* Section 1 — Search & Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white border border-border p-4 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="keyword" className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-textSecondary shrink-0" size={18} />
              <input
                id="keyword"
                type="text"
                placeholder="Search name, skill, headline..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-lg text-base text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition"
                style={{ minHeight: '48px', fontSize: '16px' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-xs font-bold text-textSecondary uppercase tracking-widest pl-1">
              Filter by City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-textSecondary shrink-0" size={18} />
              <input
                id="city"
                type="text"
                placeholder="e.g. Mumbai"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-lg text-base text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition"
                style={{ minHeight: '48px', fontSize: '16px' }}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>

        {/* Section 2 — Browse by Skills (Skill Chips) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-bold text-textPrimary">
              Filter by Skill
            </h2>
            {(selectedSkill || searchKeyword || searchCity) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:underline transition"
              >
                <FilterX size={16} />
                Clear Filters
              </button>
            )}
          </div>

          {skillsLoading ? (
            <div className="flex gap-2 py-2 overflow-x-auto">
              <Spinner size="sm" />
            </div>
          ) : (
            <div className="flex gap-2.5 py-2 overflow-x-auto no-scrollbar scroll-smooth">
              {/* "All" chip */}
              <button
                type="button"
                onClick={() => setSelectedSkill('')}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 select-none flex items-center justify-center shrink-0 ${
                  selectedSkill === ''
                    ? 'bg-teal-primary text-white border-teal-primary shadow-xs font-bold'
                    : 'bg-white text-teal-primary border-teal-primary hover:bg-teal-primary/5 font-semibold'
                }`}
                style={{ minHeight: '40px' }}
              >
                All
              </button>
              {skills.map((skill) => {
                const isSelected = selectedSkill === skill._id;
                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => setSelectedSkill(skill._id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 select-none flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-teal-primary text-white border-teal-primary shadow-xs font-bold'
                        : 'bg-white text-teal-primary border-teal-primary hover:bg-teal-primary/5 font-semibold'
                    }`}
                    style={{ minHeight: '40px' }}
                  >
                    {skill.icon && <span className="mr-1.5">{skill.icon}</span>}
                    <span>{skill.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3 — Provider Results */}
        <div className="flex flex-col gap-6 mt-2">
          <h2 className="text-xl font-bold text-textPrimary border-b border-border pb-3">
            Available Skill Providers
          </h2>

          {providersLoading ? (
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
            <div className="bg-white border border-border border-dashed rounded-3xl p-12 text-center max-w-xl mx-auto w-full flex flex-col items-center gap-4">
              <FilterX size={48} className="text-textSecondary/40" />
              <div>
                <h3 className="text-lg font-bold text-textPrimary">No providers found</h3>
                <p className="text-textSecondary text-sm mt-1 leading-relaxed">
                  No providers found. Try a different skill or location.
                </p>
              </div>
              <Button onClick={handleClearFilters} variant="secondary" className="mt-2">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default BrowseSkills;
