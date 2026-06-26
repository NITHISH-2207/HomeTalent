import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import providerService from '../../services/providerService.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Card from '../../components/common/Card.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ArrowLeft, Check, Plus, Trash2, Upload, AlertCircle, Calendar } from 'lucide-react';
import { DAYS_OF_WEEK, PRICING_UNITS } from '../../utils/constants.js';

export const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Master lists
  const [allSkills, setAllSkills] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]); // Array of skill ObjectIds
  const [pricing, setPricing] = useState({ minPrice: '', maxPrice: '', unit: 'negotiable' });
  const [availability, setAvailability] = useState({
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false
  });
  const [portfolioImages, setPortfolioImages] = useState([]);

  // Fetch initial profile & skills
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // Load master skills
        const skillsData = await providerService.getSkills();
        setAllSkills(skillsData);

        if (user && user.hasProviderProfile) {
          const profile = await providerService.getProviderById(user._id);
          if (profile) {
            setHeadline(profile.headline || '');
            setBio(profile.bio || '');
            setSelectedSkills(profile.skills ? profile.skills.map(s => s._id) : []);
            setPricing({
              minPrice: profile.pricing?.minPrice || '',
              maxPrice: profile.pricing?.maxPrice || '',
              unit: profile.pricing?.unit || 'negotiable'
            });
            setAvailability(profile.availability || {
              monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false
            });
            setPortfolioImages(profile.portfolioImages || []);
          }
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
        setError('Failed to load your profile setup. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Skill select handler (Strict UX Rule 5: Chips only)
  const toggleSkill = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Availability switch handler (Strict UX Rule 6: Toggle switches)
  const toggleDay = (dayKey) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  // Portfolio image upload handler
  const handleImageUpload = async (e) => {
    setError('');
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Build form data
    const formData = new FormData();
    files.forEach(file => {
      formData.append('portfolioImages', file);
    });

    setUploading(true);
    try {
      const response = await providerService.uploadPortfolio(formData);
      setPortfolioImages(response.portfolioImages);
      setSuccess('Portfolio photos uploaded successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload portfolio photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedSkills.length === 0) {
      setError('Please select at least one skill/service you offer.');
      return;
    }

    if (!pricing.minPrice || !pricing.maxPrice) {
      setError('Please set your pricing range.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        headline,
        bio,
        skills: selectedSkills,
        availability,
        pricing: {
          minPrice: Number(pricing.minPrice),
          maxPrice: Number(pricing.maxPrice),
          unit: pricing.unit
        }
      };

      if (user.hasProviderProfile) {
        // Update profile
        await providerService.updateProfile(payload);
        setSuccess('Profile updated successfully!');
      } else {
        // Create profile
        await providerService.createProfile(payload);
        setSuccess('Provider profile created successfully!');
      }

      // Sync active session claims
      await refreshUser();

      setTimeout(() => {
        navigate('/provider/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {/* Back header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              {user?.hasProviderProfile ? 'Edit Provider Profile' : 'Setup Provider Profile'}
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Fill in your details to start advertising your skills in Bandra/Khar.
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner className="py-24" size="lg" />
        ) : (
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 w-full mt-2">
            
            {/* Headline & Bio Card */}
            <Card hoverable={false} className="border border-border flex flex-col gap-4">
              <h3 className="font-heading font-bold text-base text-textPrimary border-b border-border pb-2">
                General Profile Details
              </h3>

              <Input
                label="Headline (Quick Intro)"
                id="headline"
                placeholder="e.g. Expert Home Baker with 15 years experience"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="bio" className="font-heading font-medium text-textPrimary text-sm">
                  Biography / Background <span className="text-error">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  placeholder="Tell clients about your skills, how you learned, and how you deliver your service..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150"
                  style={{ fontSize: '16px' }}
                  required
                />
              </div>
            </Card>

            {/* Skill Tappable Chips (Strict UX Rule 5: Chips ONLY) */}
            <Card hoverable={false} className="border border-border flex flex-col gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-textPrimary">
                  Choose Your Skills <span className="text-error">*</span>
                </h3>
                <p className="text-xs text-textSecondary mt-0.5">
                  Select all services you can provide to customers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-2 bg-gray-50 border border-border p-4 rounded-xl">
                {allSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill._id);
                  return (
                    <button
                      key={skill._id}
                      type="button"
                      onClick={() => toggleSkill(skill._id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 select-none flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-primary text-white border-teal-primary shadow-xs'
                          : 'bg-white text-textSecondary border-border hover:bg-gray-50'
                      }`}
                      style={{ minHeight: '40px' }} // chip height
                    >
                      <span>{skill.icon}</span>
                      <span>{skill.name}</span>
                      {isSelected && <Check size={14} className="ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Weekly Availability Switches (Strict UX Rule 6: Switches only) */}
            <Card hoverable={false} className="border border-border flex flex-col gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-textPrimary flex items-center gap-1.5">
                  <Calendar size={18} className="text-teal-primary" />
                  Configure Weekly Availability <span className="text-error">*</span>
                </h3>
                <p className="text-xs text-textSecondary mt-0.5">
                  Toggle the days you are available to receive client requests.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 mt-2 bg-gray-50 border border-border p-4 rounded-xl">
                {DAYS_OF_WEEK.map((day) => {
                  const isAvailable = availability[day.key] === true;
                  return (
                    <div key={day.key} className="flex items-center justify-between text-sm py-1">
                      <span className="font-bold text-textPrimary">{day.label}day</span>
                      
                      {/* Styled switch button (minimum target 48px is key) */}
                      <button
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-primary/50 items-center`}
                        style={{ backgroundColor: isAvailable ? '#2A9D8F' : '#E5E7EB', minHeight: '48px', width: '56px' }}
                        aria-label={`Toggle availability for ${day.label}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
                          style={{ transform: isAvailable ? 'translateX(28px)' : 'translateX(4px)' }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Pricing details */}
            <Card hoverable={false} className="border border-border flex flex-col gap-4">
              <h3 className="font-heading font-bold text-base text-textPrimary border-b border-border pb-2">
                Pricing Range
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Price (₹)"
                  id="minPrice"
                  type="number"
                  placeholder="e.g. 300"
                  value={pricing.minPrice}
                  onChange={(e) => setPricing(prev => ({ ...prev, minPrice: e.target.value }))}
                  required
                />
                <Input
                  label="Maximum Price (₹)"
                  id="maxPrice"
                  type="number"
                  placeholder="e.g. 800"
                  value={pricing.maxPrice}
                  onChange={(e) => setPricing(prev => ({ ...prev, maxPrice: e.target.value }))}
                  required
                />
              </div>

              {/* Pricing units */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="font-heading font-medium text-textPrimary text-sm">
                  Pricing Basis
                </label>
                <div className="flex gap-2.5 flex-wrap">
                  {PRICING_UNITS.map((unit) => {
                    const isSelected = pricing.unit === unit.value;
                    return (
                      <button
                        key={unit.value}
                        type="button"
                        onClick={() => setPricing(prev => ({ ...prev, unit: unit.value }))}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border transition duration-150 select-none ${
                          isSelected
                            ? 'bg-teal-primary text-white border-teal-primary shadow-xs'
                            : 'bg-white text-textSecondary border-border hover:bg-gray-50'
                        }`}
                        style={{ minHeight: '40px' }}
                      >
                        {unit.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Portfolio media uploads */}
            <Card hoverable={false} className="border border-border flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-2 flex-wrap gap-2">
                <h3 className="font-heading font-bold text-base text-textPrimary">
                  Portfolio Images
                </h3>
                {uploading && <Spinner size="sm" />}
              </div>

              {/* Upload controls */}
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="portfolioUpload"
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer text-textSecondary font-semibold"
                  style={{ minHeight: '48px' }}
                >
                  <Upload size={20} className="text-teal-primary" />
                  <span>Choose Portfolio Photos</span>
                  <input
                    id="portfolioUpload"
                    name="portfolioUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-textSecondary italic">
                  Upload high quality work sample photos (max 5MB each). Supported formats: JPEG, PNG.
                </p>
              </div>

              {/* Photo Preview Grids */}
              {portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2">
                  {portfolioImages.map((imgUrl, idx) => {
                    const fullUrl = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`;
                    return (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border group bg-gray-50">
                        <img
                          src={fullUrl}
                          alt={`Portfolio index ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* We could add delete button, currently displays in grid */}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Errors display */}
            {error && (
              <div className="flex gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-error font-semibold items-center">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success display */}
            {success && (
              <div className="flex gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-success font-semibold items-center">
                <Check size={20} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Primary Save Action */}
            <Button
              type="submit"
              disabled={submitting}
              fullWidth
              className="mt-2 tap-target-btn shadow-lg hover:shadow-xl shadow-teal-primary/20"
            >
              {submitting ? 'Saving Profile Details...' : 'Save Profile Settings'}
            </Button>

          </form>
        )}
      </div>
    </PageWrapper>
  );
};

export default EditProfile;
export { default as Dashboard } from './Dashboard.jsx';
