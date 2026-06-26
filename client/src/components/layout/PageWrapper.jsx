import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import BottomNav from './BottomNav.jsx';

export const PageWrapper = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Dynamic Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in" {...props}>
        <div className={`flex-1 flex flex-col ${className}`}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Safe padding in wrapper, visible only on small devices) */}
      <BottomNav />

      {/* Standard Footer */}
      <Footer />
    </div>
  );
};

export default PageWrapper;
