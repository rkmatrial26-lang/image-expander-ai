import React from 'react';

const Features: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Features</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Seamless AI-Powered Expansion</h3>
          <p className="text-gray-600 dark:text-gray-400">Our generative AI understands the context of your image to create a natural-looking, expanded background. No more awkward crops!</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Multiple Aspect Ratios</h3>
          <p className="text-gray-600 dark:text-gray-400">Quickly resize your images for social media, presentations, or any other format with our predefined aspect ratios.</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Free and Easy to Use</h3>
          <p className="text-gray-600 dark:text-gray-400">No sign-up required. Just upload your image and start expanding. It's that simple.</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Multiple Variations</h3>
          <p className="text-gray-600 dark:text-gray-400">Get multiple results for each generation, so you can pick the one that looks best to you.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
