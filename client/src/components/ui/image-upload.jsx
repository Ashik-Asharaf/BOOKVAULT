import React, { useRef, useCallback, useState } from 'react';
import { Button } from './button';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ value, onChange, className = '', ...props }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const removeImage = useCallback((e) => {
    e.stopPropagation();
    setPreview('');
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        {...props}
      />
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-[90px] h-auto rounded-md object-cover"
            style={{ maxHeight: 'none' }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Drag & drop an image here</p>
            <p className="text-xs">or click to browse files</p>
          </div>
          <p className="text-xs text-gray-500">
            Supports JPG, PNG up to 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
