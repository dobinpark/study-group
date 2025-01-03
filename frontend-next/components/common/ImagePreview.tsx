'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
}

export default function ImagePreview({
  src,
  alt = '',
  onRemove,
  className = '',
}: ImagePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
        <div className="relative max-w-[90vw] max-h-[90vh]">
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
            >
              <FiMinimize2 size={20} />
            </button>
          </div>
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="relative aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
        >
          <FiMaximize2 size={16} />
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
} 