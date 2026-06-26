import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { Search, Calendar, LayoutDashboard, UserCheck, ShieldAlert } from 'lucide-react';

export const BottomNav = () => {
  const { isAuthenticated, activeMode } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40 safe-bottom flex justify-around items-center h-16">
      {activeMode === 'customer' ? (
        <>
          {/* Customer Mode Bottom Nav */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold ${
                isActive ? 'text-teal-primary' : 'text-textSecondary'
              }`
            }
          >
            <Search size={22} />
            <span className="mt-1">Browse</span>
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold ${
                isActive ? 'text-teal-primary' : 'text-textSecondary'
              }`
            }
          >
            <Calendar size={22} />
            <span className="mt-1">My Bookings</span>
          </NavLink>
        </>
      ) : (
        <>
          {/* Provider Mode Bottom Nav */}
          <NavLink
            to="/provider/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold ${
                isActive ? 'text-teal-primary' : 'text-textSecondary'
              }`
            }
          >
            <LayoutDashboard size={22} />
            <span className="mt-1">Dashboard</span>
          </NavLink>

          <NavLink
            to="/provider/requests"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold ${
                isActive ? 'text-teal-primary' : 'text-textSecondary'
              }`
            }
          >
            <Calendar size={22} />
            <span className="mt-1">Requests</span>
          </NavLink>

          <NavLink
            to="/provider/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full text-xs font-semibold ${
                isActive ? 'text-teal-primary' : 'text-textSecondary'
              }`
            }
          >
            <UserCheck size={22} />
            <span className="mt-1">My Profile</span>
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default BottomNav;
