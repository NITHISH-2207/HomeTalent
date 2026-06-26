/**
 * Formats a Date object or string into a human-readable string.
 * Example: '2026-06-25' => 'Jun 25, 2026'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default formatDate;
