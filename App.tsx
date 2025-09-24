import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AppState, OriginalImage, Theme } from './types';
import { generateMultipleExpandedImages } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageEditor from './components/ImageEditor';
import ResultView from './components/ResultView';
import ThemeToggle from './components/ThemeToggle';
import ApiKeyModal from './components/ApiKeyModal';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import FAQ from './components/FAQ';
import AdComponent from './components/AdComponent';
import HeroSection from './components/HeroSection';
import AnimatedBackground from './components/AnimatedBackground'; // Import the new component

type Page = 'app' | 'about' | 'contact';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentPage, setCurrentPage] = useState<Page>('app');
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastGenerationParams, setLastGenerationParams] = useState<{ compositeImageBase64: string } | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  
  const uploaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleImageUpload = (image: OriginalImage) => {
    setOriginalImage(image);
    setAppState('editing');
    setError(null);
    setGeneratedImages(null);
  };

  const handleGenerationRequest = (compositeImageBase64: string) => {
    setError(null);
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      setLastGenerationParams({ compositeImageBase64 });
    } else {
      executeGeneration(compositeImageBase64, apiKey);
    }
  };

  const executeGeneration = useCallback(async (compositeImageBase64: string, key: string) => {
    if (!originalImage || !key) return;

    setIsLoading(true);
    setError(null);
    setAppState('generating');
    setLastGenerationParams({ compositeImageBase64 });

    try {
      const prompt = `Expand this image by filling in the transparent areas. The new content should blend seamlessly with the original image in terms of style, lighting, and subject matter. Create a photorealistic and coherent extension of the scene.`;
      
      const resultsBase64 = await generateMultipleExpandedImages(compositeImageBase64, prompt, key);
      
      if(resultsBase64.length === 0) {
        throw new Error("The model was unable to generate images. Please try a different image.");
      }

      setGeneratedImages(resultsBase64.map(base64 => `data:image/png;base64,${base64}`));
      setAppState('done');
      
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. Please check your API Key and network connection. Error: ${errorMessage}`);
      setAppState('editing');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);
  
  const handleApiKeySubmit = (submittedKey: string) => {
    setApiKey(submittedKey);
    setIsApiKeyModalOpen(false);
    if (lastGenerationParams) {
      executeGeneration(lastGenerationParams.compositeImageBase64, submittedKey);
    }
  };

  const handleRegenerate = useCallback(() => {
    if (lastGenerationParams && apiKey) {
      handleGenerationRequest(lastGenerationParams.compositeImageBase64);
    } else if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, [lastGenerationParams, apiKey]);


  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages(null);
    setError(null);
    setAppState('idle');
    setIsLoading(false);
    setLastGenerationParams(null);
    setCurrentPage('app');
  };
  
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setAppState('idle');
  };
  
  const handleGetStarted = () => {
    if (uploaderRef.current) {
      uploaderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (currentPage === 'about') {
        return <AboutUs onBack={() => navigateTo('app')} />;
    }
    if (currentPage === 'contact') {
        return <ContactUs onBack={() => navigateTo('app')} />;
    }
    
    switch (appState) {
      case 'editing':
      case 'generating':
        return originalImage && <ImageEditor originalImage={originalImage} onGenerate={handleGenerationRequest} isLoading={isLoading} error={error} onReset={handleReset} />;
      case 'done':
        return generatedImages && originalImage && <ResultView generatedImageSrcs={generatedImages} onReset={handleReset} onRegenerate={handleRegenerate} originalFileName={originalImage.file.name}/>;
      case 'idle':
      default:
        return (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <div ref={uploaderRef} className="pt-20">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            <AdComponent />
            <HowItWorks />
            <Features />
            <FAQ />
            <AdComponent />
          </>
        )
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <AnimatedBackground />
      <div className="relative z-10">
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          isVerifying={false}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSubmit={handleApiKeySubmit}
          error={null}
        />
        <header className="p-4 flex justify-between items-center fixed top-0 left-0 right-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-20 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400 cursor-pointer" onClick={() => navigateTo('app')}>AI Image Expander</h1>
          <div className="flex items-center gap-4">
              <nav className="flex items-center gap-4 text-sm font-medium">
                  <button onClick={() => navigateTo('about')} className="text-gray-600 dark:text-gray-300 hover:text-primary-500">About</button>
                  <button onClick={() => navigateTo('contact')} className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Contact</button>
              </nav>
              <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>
        <main className="min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
          <div className="w-full max-w-7xl mx-auto transition-all duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
