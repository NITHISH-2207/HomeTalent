/**
 * Returns Tailwind color classes based on the Booking status.
 */
export const getStatusColors = (status) => {
  const normalized = (status || '').toLowerCase();
  
  switch (normalized) {
    case 'pending':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800'
      };
    case 'accepted':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-750',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-800'
      };
    case 'rejected':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800'
      };
    case 'completed':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800'
      };
    case 'cancelled':
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-800'
      };
  }
};

export default getStatusColors;
