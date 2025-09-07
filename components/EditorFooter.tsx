import React from 'react';
import { ASPECT_RATIOS } from '../constants';
import Spinner from './Spinner';

interface EditorFooterProps {
  activeRatio: number | null;
  onRatioClick: (value: number | null) => void;
  onStartOver: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  activeRatio,
  onRatioClick,
  onStartOver,
  onGenerate,
  isLoading,
}) => {
  // We filter out 'Custom' as it's not a selectable button
  const ratios = ASPECT_RATIOS.filter(r => r.label !== 'Custom');

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">Aspect Ratio:</span>
          <div className="flex items-center gap-2">
            {ratios.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => onRatioClick(value)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
                  activeRatio === value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartOver}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.2 2.2a9 9 0 1 0 5.6 11.6"/><path d="M12 2v10l4.2-4.2"/></svg>
            Start Over
          </button>
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 disabled:bg-primary-500/50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Spinner size="sm" /> : 'Generate'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default EditorFooter;