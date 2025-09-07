import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { OriginalImage } from '../types';
import { ASPECT_RATIOS } from '../constants';
import Spinner from './Spinner';
import ResizableFrame from './ResizableFrame';
import EditorFooter from './EditorFooter';

type Bounds = { x: number; y: number; width: number; height: number };

interface ImageEditorProps {
  originalImage: OriginalImage;
  onGenerate: (compositeImageBase64: string) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ originalImage, onGenerate, isLoading, error, onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageBounds, setImageBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [frameBounds, setFrameBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(ASPECT_RATIOS[1]); // Default to 1:1

  const updateImageBounds = useCallback(() => {
    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const img = imageRef.current;
      
      const imageAspectRatio = originalImage.width / originalImage.height;
      
      let scaledWidth = containerRect.width * 0.9;
      let scaledHeight = scaledWidth / imageAspectRatio;
      
      if (scaledHeight > containerRect.height * 0.9) {
          scaledHeight = containerRect.height * 0.9;
          scaledWidth = scaledHeight * imageAspectRatio;
      }

      const x = (containerRect.width - scaledWidth) / 2;
      const y = (containerRect.height - scaledHeight) / 2;
      
      const bounds = { x, y, width: scaledWidth, height: scaledHeight };
      setImageBounds(bounds);
      handleAspectRatioChange(selectedAspectRatio, bounds);
    }
  }, [originalImage, selectedAspectRatio]);

  useEffect(() => {
    updateImageBounds();
    window.addEventListener('resize', updateImageBounds);
    return () => window.removeEventListener('resize', updateImageBounds);
  }, [updateImageBounds]);

  const handleAspectRatioChange = useCallback((ratio: typeof ASPECT_RATIOS[0], currentImageBounds?: Bounds) => {
    setSelectedAspectRatio(ratio);
    const boundsToUse = currentImageBounds || imageBounds;
    if (boundsToUse.width === 0) return;

    if (ratio.value === null) { // Custom
      // Don't change frame if switching to custom, let user drive it
      return;
    }

    const { x: imgX, y: imgY, width: imgW, height: imgH } = boundsToUse;
    const newRatio = ratio.value;

    let newWidth, newHeight;
    const imageAR = imgW / imgH;

    if (imageAR > newRatio) { // Image is wider than target ratio, so match width
      newWidth = imgW;
      newHeight = newWidth / newRatio;
    } else { // Image is taller or same, so match height
      newHeight = imgH;
      newWidth = newHeight * newRatio;
    }
    
    // Center the new frame around the image
    const newX = imgX - (newWidth - imgW) / 2;
    const newY = imgY - (newHeight - imgH) / 2;
    
    setFrameBounds({ x: newX, y: newY, width: newWidth, height: newHeight });

  }, [imageBounds]);
  
  const handleAspectRatioValueChange = useCallback((value: number | null) => {
    const ratio = ASPECT_RATIOS.find(r => r.value === value);
    if(ratio) {
      handleAspectRatioChange(ratio);
    }
  }, [handleAspectRatioChange]);
  
  const handleBoundsChange = (newBounds: Bounds) => {
    setFrameBounds(newBounds);
    if(selectedAspectRatio.label !== 'Custom') {
        const customRatio = ASPECT_RATIOS.find(r => r.label === 'Custom');
        if(customRatio) setSelectedAspectRatio(customRatio);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageRef.current) return;

    const MAX_DIMENSION = 1024;
    const frameAspectRatio = frameBounds.width / frameBounds.height;
    
    let canvasW, canvasH;
    if (frameAspectRatio >= 1) { // Landscape or square
        canvasW = Math.min(frameBounds.width, MAX_DIMENSION);
        canvasH = Math.round(canvasW / frameAspectRatio);
    } else { // Portrait
        canvasH = Math.min(frameBounds.height, MAX_DIMENSION);
        canvasW = Math.round(canvasH * frameAspectRatio);
    }
    
    const scaleFactor = canvasW / frameBounds.width;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = imageRef.current;
      
      const dWidth = imageBounds.width * scaleFactor;
      const dHeight = imageBounds.height * scaleFactor;
      const dx = (imageBounds.x - frameBounds.x) * scaleFactor;
      const dy = (imageBounds.y - frameBounds.y) * scaleFactor;

      ctx.drawImage(img, dx, dy, dWidth, dHeight);
      const compositeImageBase64 = canvas.toDataURL('image/png');
      onGenerate(compositeImageBase64);
    }
  }, [onGenerate, frameBounds, imageBounds]);

  return (
    <>
      <div className="w-full flex flex-col items-center gap-4">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 px-4 py-3 rounded-md w-full max-w-3xl" role="alert">{error}</div>}
        <div 
            className="w-full flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-lg shadow-xl"
            style={{ height: 'calc(100vh - 12rem)' }}
            ref={containerRef}
        >
            <div className="relative w-full h-full">
                <img
                    ref={imageRef}
                    src={originalImage.src}
                    alt="Original"
                    className="absolute object-contain select-none"
                    style={{
                      left: `${imageBounds.x}px`,
                      top: `${imageBounds.y}px`,
                      width: `${imageBounds.width}px`,
                      height: `${imageBounds.height}px`,
                    }}
                    draggable={false}
                />
                <ResizableFrame
                    bounds={frameBounds}
                    onBoundsChange={handleBoundsChange}
                    minWidth={imageBounds.width}
                    minHeight={imageBounds.height}
                    containerRect={containerRef.current?.getBoundingClientRect()}
                    imageRect={imageBounds}
                    aspectRatio={selectedAspectRatio.value}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                        <Spinner />
                        <p className="text-white mt-4 font-medium">Expanding your masterpiece...</p>
                        <p className="text-gray-300 text-sm mt-1">This may take a moment.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      <EditorFooter 
        activeRatio={selectedAspectRatio.value}
        onRatioClick={handleAspectRatioValueChange}
        onStartOver={onReset}
        onGenerate={handleGenerateClick}
        isLoading={isLoading}
      />
    </>
  );
};

export default ImageEditor;