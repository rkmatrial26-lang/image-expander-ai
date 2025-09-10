import React from 'react';

const AboutUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">About AI Image Expander</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          Welcome to AI Image Expander, a free online tool that uses the power of generative AI to expand and enhance your images. Our mission is to provide a simple, intuitive, and powerful tool for everyone, from professional designers to casual users.
        </p>
        <p>
          This application allows you to upload an image, select a new aspect ratio, and let our AI seamlessly fill in the new space to match the original. The result is a high-quality, expanded image that looks natural and coherent.
        </p>
        <h3 className="text-2xl font-semibold pt-4">About the Creator</h3>
        <p>
          This tool was created by Rushi, a passionate developer and AI enthusiast. You can connect with Rushi on the following platforms:
        </p>
        <ul className="list-disc list-inside space-y-2 pt-2">
          <li><a href="https://www.youtube.com/@codebyrushi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">YouTube: CodeByRushi</a></li>
          <li><a href="https://www.instagram.com/codebyrushi/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Instagram: @codebyrushi</a></li>
          <li><a href="https://x.com/CodeByRushi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">X (Twitter): @CodeByRushi</a></li>
        </ul>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Expander
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
