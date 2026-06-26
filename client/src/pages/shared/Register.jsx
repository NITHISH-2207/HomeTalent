import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Card from '../../components/common/Card.jsx';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (phone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      setLoading(false);
      return;
    }

    try {
      await authService.register(name, phone, password, city, area);
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up. Phone number may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12">
      <Card hoverable={false} className="w-full max-w-md border border-border shadow-md">
        <div className="flex flex-col gap-6">
          
          <div className="text-center">
            <span className="text-teal-primary text-3xl font-bold font-heading">
              HomeTalent
            </span>
            <h2 className="text-xl font-bold text-textPrimary mt-3">Create an Account</h2>
            <p className="text-textSecondary text-sm mt-1">
              Join the hyperlocal community skill marketplace.
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 text-center py-6 animate-fade-in">
              <CheckCircle size={48} className="text-success" />
              <p className="font-heading font-bold text-lg text-textPrimary">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                id="name"
                type="text"
                placeholder="Enter full name (e.g. Anita Sharma)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City (Optional)"
                  id="city"
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  label="Area (Optional)"
                  id="area"
                  placeholder="e.g. Bandra"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error font-medium">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={loading} fullWidth className="mt-2">
                {loading ? 'Registering Account...' : 'Sign Up'}
              </Button>
            </form>
          )}

          {!success && (
            <div className="text-center text-sm border-t border-border pt-4">
              <span className="text-textSecondary">Already have an account? </span>
              <Link to="/login" className="text-teal-primary font-bold hover:underline">
                Log In
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Register;
