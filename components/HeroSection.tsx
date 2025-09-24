import React from 'react';

const HeroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
        Expand Your Images with the Power of AI
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
        Seamlessly extend the borders of your photos, illustrations, and artwork with our free AI-powered outpainting tool. No sign-up required.
      </p>
      <button
        onClick={onGetStarted}
        className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-transform transform hover:scale-105"
      >
        Get Started for Free
      </button>
    </div>
  );
};

export default HeroSection;
