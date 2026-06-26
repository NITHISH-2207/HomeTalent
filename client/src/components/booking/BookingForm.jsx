import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { Sparkles, Calendar, BadgeIndianRupee } from 'lucide-react';

export const BookingForm = ({
  skills = [],
  onSubmit,
  loading = false,
  ...props
}) => {
  const [selectedSkill, setSelectedSkill] = useState(skills[0]?._id || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedSkill) {
      setValidationError('Please select a skill / service.');
      return;
    }
    if (!preferredDate) {
      setValidationError('Please select your preferred date.');
      return;
    }
    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      setValidationError('Please enter a valid budget amount.');
      return;
    }

    onSubmit({
      skillId: selectedSkill,
      preferredDate,
      budget: Number(budget),
      message
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" {...props}>
      {/* Skill Selection (Tappable Chips ONLY as per UX Rule 5) */}
      <div className="flex flex-col gap-2">
        <label className="font-heading font-bold text-sm text-textPrimary">
          Select Service Skill <span className="text-error">*</span>
        </label>
        <div className="flex flex-wrap gap-2.5 mt-1">
          {skills.map((skill) => {
            const isSelected = selectedSkill === skill._id;
            return (
              <button
                key={skill._id}
                type="button"
                onClick={() => setSelectedSkill(skill._id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-teal-primary text-white border-teal-primary shadow-sm scale-102'
                    : 'bg-white text-textSecondary border-border hover:bg-gray-50'
                }`}
                style={{ minHeight: '40px' }} // Tappable chips
              >
                <span className="mr-1.5">{skill.icon}</span>
                {skill.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Date Field */}
      <Input
        label="Preferred Date"
        id="preferredDate"
        type="date"
        value={preferredDate}
        onChange={(e) => setPreferredDate(e.target.value)}
        required
        min={new Date().toISOString().split('T')[0]} // Block historical dates
      />

      {/* Budget Field */}
      <Input
        label="Your Budget (₹)"
        id="budget"
        type="number"
        placeholder="Enter budget (e.g. 500)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />

      {/* Custom Message Field */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="message" className="font-heading font-medium text-textPrimary text-sm">
          Details / Special Instructions
        </label>
        <textarea
          id="message"
          name="message"
          rows="3"
          placeholder="Describe what you need, specific times, or location details..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-4 py-3 rounded-lg border border-border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Error displays */}
      {validationError && (
        <p className="text-error text-sm font-semibold mt-1">{validationError}</p>
      )}

      {/* Submit button (Min 48px height enforced by Button.jsx) */}
      <Button type="submit" disabled={loading} fullWidth className="mt-2">
        {loading ? 'Submitting Booking Request...' : 'Send Booking Request'}
      </Button>
    </form>
  );
};

export default BookingForm;
export { default as BookingCard } from './BookingCard.jsx';
export { default as BookingStatusBadge } from './BookingStatusBadge.jsx';
