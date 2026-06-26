import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import { Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <PageWrapper className="flex-1 flex flex-col items-center justify-center py-16 text-center">
      <div className="max-w-md flex flex-col items-center gap-5">
        <div className="w-16 h-16 flex items-center justify-center bg-teal-primary/10 text-teal-primary rounded-2xl">
          <Search size={32} />
        </div>
        <h1 className="text-6xl font-bold text-teal-primary">404</h1>
        <h2 className="text-2xl font-bold text-textPrimary">Page Not Found</h2>
        <p className="text-textSecondary text-base leading-relaxed">
          Oops! The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>
        <Link to="/" className="mt-2">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
