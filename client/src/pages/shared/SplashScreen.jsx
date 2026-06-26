import React, { useEffect, useState } from 'react';

export const SplashScreen = ({
  onComplete,
  ...props
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate loading bar progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4; // increment progress
      });
    }, 90); // completes in roughly ~2.2 seconds

    // Complete splash screen after 2.5 seconds
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F9FA] p-6 select-none splash-fade-in"
      {...props}
    >
      <div className="flex flex-col items-center text-center gap-4 max-w-md">
        
        {/* Animated Brand Wordmark Logo */}
        <div className="wordmark-scale-up">
          <div className="animate-pulse duration-1500">
            <span className="text-teal-primary text-5xl md:text-6xl font-bold font-heading tracking-wide">
              HomeTalent
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-textSecondary text-lg font-medium leading-relaxed font-heading mt-2">
          "Skills from the heart of your neighbourhood"
        </p>

        {/* Loading Indicator Container */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-8">
          <div
            className="h-full bg-teal-primary transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
