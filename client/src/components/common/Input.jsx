import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-heading font-medium text-textPrimary text-sm">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`px-4 py-3 rounded-lg border text-base bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-primary/50 transition duration-150 ${
          error ? 'border-error ring-1 ring-error' : 'border-border'
        }`}
        style={{ fontSize: '16px', minHeight: '48px' }} // Strict UX rules
        {...props}
      />
      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
};

export default Input;
