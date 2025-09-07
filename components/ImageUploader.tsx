import React, { useCallback, useState } from 'react';
import type { OriginalImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: OriginalImage) => void;
}

const UploadIcon = () => (
    <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w.org/2000/svg">
        <path d="M8 10.5C6.7 11.2 6 12.5 6 14C6 16.2091 7.79086 18 10 18H14C16.2091 18 18 16.2091 18 14C18 12.5 17.3 11.2 16 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14L12 4M12 4L9 7M12 4L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onImageUpload({
            src: e.target?.result as string,
            width: img.width,
            height: img.height,
            file: file,
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="flex items-center justify-center w-full">
        <label
            htmlFor="dropzone-file"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center w-full max-w-2xl h-80 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-gray-800/50'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/20'
            }`}
        >
            <div className="flex flex-col items-center justify-center text-center">
                <UploadIcon/>
                <p className="mb-2 text-lg font-medium text-gray-600 dark:text-gray-300">Drag & drop an image here</p>
                <p className="text-gray-500 dark:text-gray-500 my-1">or</p>
                <span className="mt-2 inline-block px-6 py-2 text-sm font-semibold rounded-md bg-primary-600 text-white cursor-pointer hover:bg-primary-700 transition-colors duration-200">
                   Choose a file
                </span>
            </div>
            <p className="absolute bottom-6 text-xs text-gray-500">Supported formats: PNG, JPG, WEBP</p>
            <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
    </div> 
  );
};

export default ImageUploader;