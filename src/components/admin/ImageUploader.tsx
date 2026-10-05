import React, { useState, useRef } from 'react';
import { UploadCloud, X, RefreshCw } from 'lucide-react';
import { uploadImage } from '@/lib/storage';

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null, storagePath?: string | null) => void;
  storagePathPrefix: string;
  label?: string;
  altText?: string;
  onAltTextChange?: (alt: string) => void;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  storagePathPrefix,
  label = 'Cover Image',
  altText = '',
  onAltTextChange,
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image file is too large (max 20MB)');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      const fullPath = `${storagePathPrefix}/${fileName}`;

      const { url, path } = await uploadImage(file, fullPath);
      onChange(url, path);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Remove Image
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 aspect-[16/9] max-h-[360px]">
          <img
            src={value}
            alt={altText || 'Uploaded photograph preview'}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-amber-500 bg-amber-500/5'
              : 'border-stone-800 hover:border-stone-600 bg-stone-900/40 hover:bg-stone-900/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-medium text-stone-200 mb-1">
              {isUploading ? 'Processing & Optimizing WebP...' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-stone-500">
              High resolution JPEG, PNG, WebP up to 20MB (client-side compressed)
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Alt text field */}
      {value && onAltTextChange && (
        <div className="pt-2">
          <label className="text-xs text-stone-400 font-medium block mb-1.5">
            Image Alt Text (Accessibility & SEO)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="Describe the image content (e.g. Sunrise over snow-capped mountains)"
            className="w-full px-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      )}
    </div>
  );
};
