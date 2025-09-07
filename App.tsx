import React, { useState, useCallback, useEffect } from 'react';
import type { AppState, OriginalImage, Theme } from './types';
import { generateMultipleExpandedImages } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageEditor from './components/ImageEditor';
import ResultView from './components/ResultView';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastGenerationParams, setLastGenerationParams] = useState<{ compositeImageBase64: string } | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

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
    executeGeneration(compositeImageBase64);
  };

  const executeGeneration = useCallback(async (compositeImageBase64: string) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setAppState('generating');
    setLastGenerationParams({ compositeImageBase64 });

    try {
      const prompt = `Expand this image by filling in the transparent areas. The new content should blend seamlessly with the original image in terms of style, lighting, and subject matter. Create a photorealistic and coherent extension of the scene.`;
      
      const resultsBase64 = await generateMultipleExpandedImages(compositeImageBase64, prompt);
      
      if(resultsBase64.length === 0) {
        throw new Error("The model was unable to generate images. This can happen if the image is too complex or lacks sufficient context for expansion. Please try a different image.");
      }

      setGeneratedImages(resultsBase64.map(base64 => `data:image/png;base64,${base64}`));
      setAppState('done');
      
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. ${errorMessage}`);
      setAppState('editing');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleRegenerate = useCallback(() => {
    if (lastGenerationParams) {
      handleGenerationRequest(lastGenerationParams.compositeImageBase64);
    }
  }, [lastGenerationParams]);


  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages(null);
    setError(null);
    setAppState('idle');
    setIsLoading(false);
    setLastGenerationParams(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'editing':
      case 'generating':
        return originalImage && <ImageEditor originalImage={originalImage} onGenerate={handleGenerationRequest} isLoading={isLoading} error={error} onReset={handleReset} />;
      case 'done':
        return generatedImages && originalImage && <ResultView generatedImageSrcs={generatedImages} onReset={handleReset} onRegenerate={handleRegenerate} originalFileName={originalImage.file.name}/>;
      case 'idle':
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="p-4 flex justify-between items-center fixed top-0 left-0 right-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">AI Image Expander</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <main className="min-h-screen flex items-center justify-center p-4 pt-20 pb-24">
        <div className="w-full max-w-7xl mx-auto transition-all duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;