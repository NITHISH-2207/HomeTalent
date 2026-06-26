import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { Camera, Lock, LogOut, ArrowLeft, Check, ShieldAlert, KeyRound } from 'lucide-react';

export const Profile = () => {
  const { user, refreshUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Personal Info form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback states
  const [personalSuccess, setPersonalSuccess] = useState('');
  const [personalError, setPersonalError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Sync state with user data from context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCity(user.location?.city || '');
      setArea(user.location?.area || '');
      setPhotoUrl(user.profileImage || '');

      // Load aboutMe from localStorage edits if present
      const localEdits = localStorage.getItem('user_profile_edits');
      if (localEdits) {
        const parsed = JSON.parse(localEdits);
        setAboutMe(parsed.aboutMe || '');
      }
    }
  }, [user]);

  // Handle Photo File Change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPersonalError('Image must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get Initials for fallback
  const getInitials = () => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Save Personal Information Changes
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setPersonalSuccess('');
    setPersonalError('');
    setSavingPersonal(true);

    try {
      // Save edits locally
      const localEdits = {
        name,
        city,
        area,
        aboutMe,
        profileImage: photoUrl
      };
      localStorage.setItem('user_profile_edits', JSON.stringify(localEdits));

      // Refresh the context user state (calls getCurrentUser under the hood)
      await refreshUser();
      
      setPersonalSuccess('Personal information updated successfully!');
      setTimeout(() => setPersonalSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setPersonalError('Failed to save changes. Please try again.');
    } finally {
      setSavingPersonal(false);
    }
  };

  // Save Password Changes
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      // Simulate API saving
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-xl mx-auto py-2">
        {/* Back Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center bg-white"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              My Profile
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Manage your personal information, security, and session.
            </p>
          </div>
        </div>

        {/* SECTION 1 — Personal Information */}
        <Card hoverable={false} className="border border-border p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-textPrimary border-b border-border pb-2">
            Personal Information
          </h2>

          <form onSubmit={handleSavePersonal} className="flex flex-col gap-5">
            {/* Avatar & Photo Upload Center */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative group select-none">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover border border-border bg-gray-50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-teal-primary/10 text-teal-primary text-3xl font-extrabold flex items-center justify-center border border-teal-primary/20">
                    {getInitials()}
                  </div>
                )}
                
                {/* Camera Overlay Icon */}
                <label
                  htmlFor="photo-file"
                  className="absolute bottom-0 right-0 p-2 bg-teal-primary text-white rounded-full border border-white cursor-pointer hover:bg-teal-dark shadow-md transition flex items-center justify-center"
                  style={{ minHeight: '36px', minWidth: '36px' }}
                  title="Upload profile photo"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    id="photo-file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-[10px] text-textSecondary italic">
                Upload image up to 5MB
              </span>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="fullName" className="font-heading font-medium text-textPrimary text-sm">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="phone" className="font-heading font-medium text-textPrimary text-sm flex items-center gap-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="text"
                  value={user?.phone || ''}
                  readOnly
                  className="px-4 py-3 pr-10 rounded-lg border border-border text-base bg-gray-100 text-textSecondary cursor-not-allowed w-full focus:outline-none"
                />
                <Lock className="absolute right-3.5 top-3.5 text-textSecondary/60" size={16} />
              </div>
              <span className="text-[11px] text-textSecondary flex items-center gap-1 pl-1">
                🔒 Registered phone number cannot be changed.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="city" className="font-heading font-medium text-textPrimary text-sm">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="area" className="font-heading font-medium text-textPrimary text-sm">
                  Area
                </label>
                <input
                  id="area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Bandra"
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center">
                <label htmlFor="about" className="font-heading font-medium text-textPrimary text-sm">
                  About Me
                </label>
                <span className="text-xs text-textSecondary">
                  {aboutMe.length}/200
                </span>
              </div>
              <textarea
                id="about"
                rows="3"
                maxLength="200"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full resize-none"
              />
            </div>

            {/* Error / Success Feedback */}
            {personalError && (
              <div className="flex gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-error font-semibold items-center animate-fade-in">
                <ShieldAlert size={20} className="shrink-0" />
                <span>{personalError}</span>
              </div>
            )}
            {personalSuccess && (
              <div className="flex gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-success font-semibold items-center animate-fade-in">
                <Check size={20} className="shrink-0" />
                <span>{personalSuccess}</span>
              </div>
            )}

            <Button type="submit" disabled={savingPersonal} fullWidth className="mt-2 shadow-sm">
              {savingPersonal ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        </Card>

        {/* SECTION 2 — Security */}
        <Card hoverable={false} className="border border-border p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">
              Account Security
            </h2>
            <p className="text-xs text-textSecondary mt-0.5">
              Change your password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="currentPassword" className="font-heading font-medium text-textPrimary text-sm">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="newPassword" className="font-heading font-medium text-textPrimary text-sm">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="confirmPassword" className="font-heading font-medium text-textPrimary text-sm">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 w-full"
                  required
                />
              </div>
            </div>

            {/* Error / Success Feedback */}
            {passwordError && (
              <div className="flex gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-error font-semibold items-center animate-fade-in">
                <ShieldAlert size={20} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-success font-semibold items-center animate-fade-in">
                <Check size={20} className="shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <Button type="submit" disabled={savingPassword} fullWidth className="mt-2 shadow-sm">
              {savingPassword ? 'Changing Password...' : 'Save Password'}
            </Button>
          </form>
        </Card>

        {/* SECTION 3 — Account */}
        <Card hoverable={false} className="border border-border p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-textPrimary border-b border-border pb-2">
            Account Management
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Logging out of your account will clear your session on this browser. You can log back in at any time.
          </p>

          <button
            type="button"
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 border border-red-500 hover:bg-red-50 text-red-600 font-bold px-4 py-3 rounded-xl transition duration-150 tap-target-btn mt-2"
            style={{ minHeight: '48px' }}
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Profile;
