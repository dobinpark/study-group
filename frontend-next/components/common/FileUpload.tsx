'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  className?: string;
}

export default function FileUpload({
  onUpload,
  accept = '*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 기본 5MB
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFiles = (files: File[]) => {
    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
      }
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    
    try {
      validateFiles(droppedFiles);
      setIsLoading(true);
      await onUpload(droppedFiles);
    } catch (error) {
      setError(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);

    try {
      validateFiles(selectedFiles);
      setIsLoading(true);
      await onUpload(selectedFiles);
    } catch (error) {
      setError(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <LoadingSpinner size="medium" />
        ) : (
          <>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              파일을 드래그하여 업로드하거나 클릭하여 선택하세요
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {`최대 ${maxSize / 1024 / 1024}MB`}
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <FiX className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
} 