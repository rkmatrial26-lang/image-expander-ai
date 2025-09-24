import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-primary-100 dark:bg-primary-900/50 rounded-full p-4 mb-4">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">1. Upload Your Image</h3>
          <p className="text-gray-600 dark:text-gray-400">Drag and drop your image or click to select a file from your device. We support PNG, JPG, and WEBP formats.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-100 dark:bg-primary-900/50 rounded-full p-4 mb-4">
             <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">2. Choose Aspect Ratio</h3>
          <p className="text-gray-600 dark:text-gray-400">Select a new aspect ratio for your image. You can choose from presets like 1:1, 16:9, or use the custom handles to resize freely.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-primary-100 dark:bg-primary-900/50 rounded-full p-4 mb-4">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">3. Generate & Download</h3>
          <p className="text-gray-600 dark:text-gray-400">Our AI will expand your image to the new dimensions. You'll get multiple variations to choose from. Download your favorite!</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
