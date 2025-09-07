import React, { useState, useMemo } from 'react';

interface ResultViewProps {
  generatedImageSrcs: string[];
  onReset: () => void;
  onRegenerate: () => void;
  originalFileName: string;
}

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const NewImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const RegenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
);

const LeftArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6"/>
    </svg>
);

const RightArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
    </svg>
);


const ResultView: React.FC<ResultViewProps> = ({ generatedImageSrcs, onReset, onRegenerate, originalFileName }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const currentIndex = useMemo(() => {
        if (!selectedImage) return -1;
        return generatedImageSrcs.indexOf(selectedImage);
    }, [selectedImage, generatedImageSrcs]);

    const handleNext = () => {
        if (currentIndex === -1 || generatedImageSrcs.length <= 1) return;
        const nextIndex = (currentIndex + 1) % generatedImageSrcs.length;
        setSelectedImage(generatedImageSrcs[nextIndex]);
    };

    const handlePrevious = () => {
        if (currentIndex === -1 || generatedImageSrcs.length <= 1) return;
        const prevIndex = (currentIndex - 1 + generatedImageSrcs.length) % generatedImageSrcs.length;
        setSelectedImage(generatedImageSrcs[prevIndex]);
    };

    const getDownloadFileName = () => {
        const nameWithoutExt = originalFileName.split('.').slice(0, -1).join('.');
        const indexSuffix = generatedImageSrcs.length > 1 ? `-${currentIndex + 1}` : '';
        return `${nameWithoutExt}-expanded${indexSuffix}.png`;
    }

    if (selectedImage) {
        return (
             <div className="flex flex-col items-center gap-6 w-full animate-fade-in">
                <div className="relative max-w-4xl w-full rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={selectedImage} alt="Selected result" className="w-full h-auto" />
                     {generatedImageSrcs.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                aria-label="Previous image"
                            >
                                <LeftArrowIcon />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                aria-label="Next image"
                            >
                                <RightArrowIcon />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full select-none">
                                {currentIndex + 1} / {generatedImageSrcs.length}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                    href={selectedImage}
                    download={getDownloadFileName()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    >
                        <DownloadIcon />
                        Download
                    </a>
                     <button
                    onClick={() => setSelectedImage(null)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    >
                        <BackIcon />
                        Choose Another
                    </button>
                    <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    >
                        <NewImageIcon />
                        Expand Another
                    </button>
                </div>
            </div>
        )
    }

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-fade-in">
      <h2 className="text-3xl font-bold text-center">Your Expanded Image is Ready!</h2>
      <p className="text-gray-500 dark:text-gray-400">Choose your favorite variation below.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {generatedImageSrcs.map((src, index) => (
            <div key={index} className="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all" onClick={() => setSelectedImage(src)}>
                <img src={src} alt={`Generated variation ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-md">Select</span>
                </div>
            </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
        >
          <RegenerateIcon />
          Regenerate
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
        >
          <NewImageIcon />
          Expand Another
        </button>
      </div>
    </div>
  );
};

export default ResultView;