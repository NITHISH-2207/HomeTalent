import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useNotifications from '../../hooks/useNotifications.js';
import providerService from '../../services/providerService.js';
import bookingService from '../../services/bookingService.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { LayoutDashboard, CalendarClock, CheckCircle, Star, Bell, PlusCircle, Wrench, Edit3, MessageSquare } from 'lucide-react';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [providerProfile, setProviderProfile] = useState(null);
  const [metrics, setMetrics] = useState({
    pendingCount: 0,
    completedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      // If user hasProviderProfile, load profile and bookings metrics
      if (user.hasProviderProfile) {
        try {
          setLoading(true);
          const profile = await providerService.getProviderById(user._id);
          setProviderProfile(profile);

          const bookings = await bookingService.getIncomingRequests();
          const pending = bookings.filter(b => b.status === 'pending').length;
          const completed = bookings.filter(b => b.status === 'completed').length;

          setMetrics({
            pendingCount: pending,
            completedCount: completed
          });
        } catch (err) {
          console.error('Error fetching dashboard details:', err);
          setError('Failed to fetch provider details. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Handler to pull updated context state after profile creation
  const handleOnboardSubmit = () => {
    navigate('/provider/profile');
  };

  // Removed Onboarding Empty State checking block to allow immediate dashboard rendering

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} className="text-teal-primary" />
            <div>
              <h1 className="text-2xl font-bold text-textPrimary leading-tight">
                Provider Dashboard
              </h1>
              <p className="text-textSecondary text-sm mt-0.5">
                Overview of bookings, reviews, and profile settings.
              </p>
            </div>
          </div>
          
          {providerProfile && (
            <Link to={`/provider/${providerProfile?.userId?._id}`}>
              <Button variant="secondary" className="tap-target-btn text-sm py-2">
                Preview Public Profile
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <Spinner className="py-24" size="lg" />
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 mt-2 animate-fade-in">
            {/* Summary Metrics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Metric Card 1: Pending */}
              <Card hoverable={false} className="border border-border p-5 flex flex-col justify-between" style={{ minHeight: '120px' }}>
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                  Pending Jobs
                </span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-extrabold text-amber-500">{metrics.pendingCount}</span>
                  <CalendarClock className="text-amber-500/20 shrink-0" size={32} />
                </div>
              </Card>

              {/* Metric Card 2: Completed */}
              <Card hoverable={false} className="border border-border p-5 flex flex-col justify-between" style={{ minHeight: '120px' }}>
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                  Completed Jobs
                </span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-extrabold text-teal-primary">{providerProfile?.completedBookings || 0}</span>
                  <CheckCircle className="text-teal-primary/20 shrink-0" size={32} />
                </div>
              </Card>

              {/* Metric Card 3: Reviews Score */}
              <Card hoverable={false} className="border border-border p-5 flex flex-col justify-between" style={{ minHeight: '120px' }}>
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                  Avg Rating
                </span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-extrabold text-terracotta">{providerProfile?.averageRating || '0.0'}</span>
                  <Star className="text-terracotta/20 shrink-0" size={32} />
                </div>
              </Card>

              {/* Metric Card 4: Unread Alerts */}
              <Card hoverable={false} className="border border-border p-5 flex flex-col justify-between" style={{ minHeight: '120px' }}>
                <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                  Alerts
                </span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-extrabold text-red-500">{unreadCount}</span>
                  <Bell className="text-red-500/20 shrink-0" size={32} />
                </div>
              </Card>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Action: Bookings Management */}
              <Card hoverable className="border border-border p-6 flex flex-col gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-xl">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-textPrimary text-base">Booking Requests</h3>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                    View new service requests, accept appointments, or mark ongoing jobs as completed.
                  </p>
                </div>
                <Link to="/provider/requests" className="mt-auto">
                  <Button variant="secondary" fullWidth className="text-sm">
                    Manage Bookings ({metrics.pendingCount})
                  </Button>
                </Link>
              </Card>

              {/* Action: Edit profile details */}
              <Card hoverable className="border border-border p-6 flex flex-col gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-xl">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-textPrimary text-base">Edit Profile & Skills</h3>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                    Update your biography, pricing ranges, service skills, and upload work photos.
                  </p>
                </div>
                <Link to="/provider/profile" className="mt-auto">
                  <Button variant="secondary" fullWidth className="text-sm">
                    Edit Profile Details
                  </Button>
                </Link>
              </Card>

              {/* Action: View feedbacks */}
              <Card hoverable className="border border-border p-6 flex flex-col gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-xl">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-textPrimary text-base">Feedback & Reviews</h3>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                    Read feedback, scores, and testimonials submitted by clients in Bandra/Khar.
                  </p>
                </div>
                <Link to="/provider/reviews" className="mt-auto">
                  <Button variant="secondary" fullWidth className="text-sm">
                    View Customer Reviews
                  </Button>
                </Link>
              </Card>

            </div>

          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
