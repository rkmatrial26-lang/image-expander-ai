import React, { useState } from 'react';
import Spinner from './Spinner';

interface ApiKeyModalProps {
  isOpen: boolean;
  isVerifying: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
  error?: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, isVerifying, onClose, onSubmit, error }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-labelledby="api-key-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 md:p-8 border border-gray-700"
      >
        <h2 id="api-key-modal-title" className="text-2xl font-bold text-white mb-4">
          Enter Your Gemini API Key
        </h2>

        <div className="text-gray-400 text-sm space-y-3 mb-6">
            <p className="font-semibold text-gray-300">How to get your free Gemini API Key:</p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Google AI Studio</a>.</li>
                <li>Sign in with your Google account.</li>
                <li>Click the <span className="font-semibold">"Get API key"</span> button, usually found in the top left or side menu.</li>
                <li>Click <span className="font-semibold">"Create API key in new project"</span>. A pop-up will show you the new key.</li>
                <li>Click the copy icon to copy your key.</li>
                <li>Return to this app and paste the key in the field below to begin.</li>
            </ol>
        </div>

        <div>
          <label htmlFor="api-key-input" className="sr-only">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Paste your API key here"
            required
            autoComplete="off"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isVerifying}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!apiKey.trim() || isVerifying}
            className="px-6 py-2 text-sm font-semibold rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 disabled:bg-primary-500/50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
          >
            {isVerifying ? <Spinner size="sm" /> : 'Start Generation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiKeyModal;