import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import authService from '../../services/authService.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Card from '../../components/common/Card.jsx';
import { User, Wrench, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();

  // Phase controller state
  const [phase, setPhase] = useState(1); // 1 = credentials form, 2 = mode selector

  // Form State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Temporary credentials verification cache for Phase 2
  const [authCache, setAuthCache] = useState(null); // { user, token }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(phone, password);
      
      // Verification succeeded: cache credentials and flip to Phase 2 selection card
      setAuthCache({
        user: {
          _id: data._id,
          name: data.name,
          phone: data.phone,
          location: data.location,
          profileImage: data.profileImage,
          hasProviderProfile: data.hasProviderProfile
        },
        token: data.token
      });
      
      setPhase(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid phone number or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChoice = (chosenMode) => {
    if (!authCache) return;
    
    // Complete context login setup
    completeLogin(authCache.user, authCache.token, chosenMode);

    // Redirect to respective homepage
    if (chosenMode === 'provider') {
      navigate('/provider/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <Card hoverable={false} className="w-full max-w-md border border-border shadow-md">
        
        {/* Phase 1: Credentials Screen */}
        {phase === 1 && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="text-teal-primary text-3xl font-bold font-heading">
                HomeTalent
              </span>
              <h2 className="text-xl font-bold text-textPrimary mt-3">Welcome Back</h2>
              <p className="text-textSecondary text-sm mt-1">
                Log in to search skills or manage requests.
              </p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error font-medium">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={loading} fullWidth className="mt-2">
                {loading ? 'Verifying Credentials...' : 'Log In'}
              </Button>
            </form>

            <div className="text-center text-sm border-t border-border pt-4">
              <span className="text-textSecondary">New to HomeTalent? </span>
              <Link to="/register" className="text-teal-primary font-bold hover:underline">
                Create an Account
              </Link>
            </div>
          </div>
        )}

        {/* Phase 2: Card selector shown in-place (No navigation) */}
        {phase === 2 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="text-center">
              <span className="text-teal-primary text-lg font-bold font-heading uppercase tracking-widest">
                Verification Successful
              </span>
              <h2 className="text-xl font-bold text-textPrimary mt-2">Continue as...</h2>
              <p className="text-textSecondary text-sm mt-1">
                Select your dashboard mode for this session.
              </p>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Selector Card */}
              <button
                onClick={() => handleModeChoice('customer')}
                className="flex flex-col items-center justify-center p-5 border border-border rounded-2xl hover:border-teal-primary bg-white hover:bg-teal-light/5 text-center transition group select-none cursor-pointer"
                style={{ minHeight: '160px' }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-xl mb-3.5 group-hover:scale-105 transition">
                  <User size={26} />
                </div>
                <span className="font-heading font-bold text-sm text-textPrimary">Customer</span>
                <span className="text-[10px] text-textSecondary mt-1 leading-relaxed px-1">
                  Browse and book local services
                </span>
              </button>

              {/* Provider Selector Card */}
              <button
                onClick={() => handleModeChoice('provider')}
                className="flex flex-col items-center justify-center p-5 border border-border rounded-2xl hover:border-teal-primary bg-white hover:bg-teal-light/5 text-center transition group select-none cursor-pointer"
                style={{ minHeight: '160px' }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-xl mb-3.5 group-hover:scale-105 transition">
                  <Wrench size={26} />
                </div>
                <span className="font-heading font-bold text-sm text-textPrimary">Provider</span>
                <span className="text-[10px] text-textSecondary mt-1 leading-relaxed px-1">
                  Manage your skills and bookings
                </span>
              </button>
            </div>

            {/* Back button option */}
            <button
              onClick={() => setPhase(1)}
              className="text-xs text-textSecondary font-semibold text-center hover:underline focus:outline-none"
            >
              ← Back to credentials login
            </button>
          </div>
        )}

      </Card>
    </div>
  );
};

export default Login;
