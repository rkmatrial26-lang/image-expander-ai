import React, { useState, useCallback, useEffect } from 'react';
import type { AppState, OriginalImage, Theme } from './types';
import { generateMultipleExpandedImages } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageEditor from './components/ImageEditor';
import ResultView from './components/ResultView';
import ThemeToggle from './components/ThemeToggle';
import ApiKeyModal from './components/ApiKeyModal'; // Import the modal

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastGenerationParams, setLastGenerationParams] = useState<{ compositeImageBase64: string } | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  
  // State for API Key management
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

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
    // Check for API key before generating
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      // Store the image data to be used after key is entered
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
      
      // Pass the key to the service function
      const resultsBase64 = await generateMultipleExpandedImages(compositeImageBase64, prompt, key);
      
      if(resultsBase64.length === 0) {
        throw new Error("The model was unable to generate images. Please try a different image.");
      }

      setGeneratedImages(resultsBase64.map(base64 => `data:image/png;base64,${base64}`));
      setAppState('done');
      
    } catch (err) {
      console.error(err);
      // This will now catch an invalid API key error during the actual generation attempt
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image. Please check your API Key and network connection. Error: ${errorMessage}`);
      setAppState('editing');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);
  
  // This function is now much simpler. It doesn't verify the key, it just uses it.
  const handleApiKeySubmit = (submittedKey: string) => {
    setApiKey(submittedKey);
    setIsApiKeyModalOpen(false);
    // If there's a pending generation, run it now with the new key
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
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        isVerifying={false} // This is no longer needed
        onClose={() => setIsApiKeyModalOpen(false)}
        onSubmit={handleApiKeySubmit}
        error={null} // This is no longer needed
      />
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
