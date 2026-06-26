import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-teal-primary text-lg font-bold font-heading">
            HomeTalent
          </span>
          <p className="text-xs text-textSecondary text-center md:text-left">
            Skills from the heart of your neighbourhood. Connecting homemakers & retirees.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-textSecondary font-medium">
          <span className="hover:text-teal-primary cursor-pointer">About Us</span>
          <span className="hover:text-teal-primary cursor-pointer">Safety Guidelines</span>
          <span className="hover:text-teal-primary cursor-pointer">Terms & Privacy</span>
        </div>
        <p className="text-xs text-textSecondary">
          &copy; {new Date().getFullYear()} HomeTalent. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
