import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import NotificationBell from '../notifications/NotificationBell.jsx';
import { User, LogOut, ArrowLeftRight, LayoutDashboard, Search } from 'lucide-react';
import Button from '../common/Button.jsx';
import Avatar from '../common/Avatar.jsx';

export const Navbar = () => {
  const { user, activeMode, switchToProvider, switchToCustomer, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-sm font-semibold px-2 py-1 rounded-md transition ${
      isActive ? 'text-teal-primary font-bold' : 'text-textSecondary hover:text-textPrimary'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4">
          <Link to={activeMode === 'provider' ? '/provider/dashboard' : '/'} className="flex items-center gap-2">
            <span className="text-teal-primary text-2xl font-bold font-heading tracking-wide">
              HomeTalent
            </span>
            <span className="hidden sm:inline-block bg-teal-light/10 text-teal-dark border border-teal-light/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
              {activeMode === 'provider' ? '🛠 Provider Mode' : '👤 Customer Mode'}
            </span>
          </Link>

          {/* Navigation Links (visible on desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 border-l border-border pl-4 ml-2">
              {activeMode === 'customer' ? (
                <>
                  <Link to="/browse" className={getLinkClass('/browse')}>
                    Browse Services
                  </Link>
                  <Link to="/bookings" className={getLinkClass('/bookings')}>
                    My Bookings
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/provider/dashboard" className={getLinkClass('/provider/dashboard')}>
                    Provider Dashboard
                  </Link>
                  <Link to="/provider/requests" className={getLinkClass('/provider/requests')}>
                    Booking Requests
                  </Link>
                  <Link to="/provider/reviews" className={getLinkClass('/provider/reviews')}>
                    Reviews
                  </Link>
                </>
              )}
              <Link to="/provider/profile" className={getLinkClass('/provider/profile')}>
                Profile
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Mode Toggle Button */}
              {activeMode === 'customer' ? (
                <button
                  onClick={() => switchToProvider(navigate)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-teal-primary border border-teal-primary/45 bg-white hover:bg-teal-primary/5 transition tap-target-btn animate-fade-in"
                  style={{ minHeight: '48px' }}
                  title="Switch to Provider interface"
                >
                  <ArrowLeftRight size={18} />
                  <span className="hidden sm:inline">Switch to Provider</span>
                </button>
              ) : (
                <button
                  onClick={() => switchToCustomer(navigate)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-teal-primary border border-teal-primary/45 bg-white hover:bg-teal-primary/5 transition tap-target-btn animate-fade-in"
                  style={{ minHeight: '48px' }}
                  title="Switch to Customer interface"
                >
                  <ArrowLeftRight size={18} />
                  <span className="hidden sm:inline">Switch to Customer</span>
                </button>
              )}

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Avatar with simple dropdown/details */}
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-sm font-semibold text-textPrimary leading-tight">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold font-mono">
                    {activeMode}
                  </span>
                </div>
                <Avatar src={user?.profileImage} alt={user?.name || 'User'} size="sm" />
                <button
                  onClick={handleLogout}
                  className="p-2 text-textSecondary hover:text-error rounded-full hover:bg-red-50 transition tap-target-btn"
                  style={{ minHeight: '48px' }}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
