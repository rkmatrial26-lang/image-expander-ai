import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">What is AI Image Expander?</h3>
          <p className="text-gray-600 dark:text-gray-400">AI Image Expander is a free online tool that uses generative AI to expand your images. It's also known as "outpainting." You can use it to change the aspect ratio of an image or to extend the background of a photo.</p>
        </div>
        <div>
          <h3 className="font-semibold">How much does it cost?</h3>
          <p className="text-gray-600 dark:text-gray-400">This tool is completely free to use. You will need to provide your own Gemini API key, which you can get for free from Google AI Studio.</p>
        </div>
        <div>
          <h3 className="font-semibold">What kind of images work best?</h3>
          <p className="text-gray-600 dark:text-gray-400">Images with clear subjects and backgrounds that have some texture or pattern tend to work best. The AI will have more information to work with to create a seamless expansion.</p>
        </div>
         <div>
          <h3 className="font-semibold">Is my data safe?</h3>
          <p className="text-gray-600 dark:text-gray-400">We do not store your images. All processing is done in your browser and through the Google Gemini API. Your images are your own.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
