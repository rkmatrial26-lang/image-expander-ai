import React from 'react';

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          We'd love to hear from you! If you have any questions, feedback, or suggestions, please don't hesitate to get in touch.
        </p>
        <p>
          The best way to reach out is through our social media channels. Please connect with us on:
        </p>
        <ul className="list-disc list-inside space-y-2 pt-2">
            <li><a href="https://www.instagram.com/codebyrushi/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Instagram: @codebyrushi</a></li>
            <li><a href="https://x.com/CodeByRushi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">X (Twitter): @CodeByRushi</a></li>
        </ul>
         <p className="pt-4">
          For business inquiries, you can also reach out via email at: <a href="mailto:codebyrushi@gmail.com" className="text-primary-500 hover:underline">codebyrushi@gmail.com</a>
        </p>
        <p>
            We appreciate your interest in AI Image Expander and look forward to hearing from you!
        </p>
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

export default ContactUs;
