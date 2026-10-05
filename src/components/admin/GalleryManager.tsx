import React, { useState, useRef } from 'react';
import { UploadCloud, X, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/storage';

export interface GalleryPhotoItem {
  image_url: string;
  storage_path?: string;
  caption?: string;
  sort_order: number;
}

interface GalleryManagerProps {
  photos: GalleryPhotoItem[];
  onChange: (photos: GalleryPhotoItem[]) => void;
  articleIdPrefix: string;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  photos,
  onChange,
  articleIdPrefix,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newItems: GalleryPhotoItem[] = [...photos];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}: ${file.name}...`);

      try {
        const fileName = `photo-${Date.now()}-${i}.webp`;
        const storagePath = `articles/${articleIdPrefix}/${fileName}`;
        const { url, path } = await uploadImage(file, storagePath);

        newItems.push({
          image_url: url,
          storage_path: path,
          caption: '',
          sort_order: newItems.length + 1,
        });
      } catch (err) {
        console.error('Error uploading gallery photo:', err);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    onChange(newItems);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...photos];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // Re-index sort order
    onChange(updated.map((item, idx) => ({ ...item, sort_order: idx + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return;
    const updated = [...photos];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated.map((item, idx) => ({ ...item, sort_order: idx + 1 })));
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          Story Photo Gallery ({photos.length} photos)
        </label>
      </div>

      {/* Multi-file Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-amber-500 bg-amber-500/5'
            : 'border-stone-800 hover:border-stone-600 bg-stone-900/40 hover:bg-stone-900/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-sm font-medium text-stone-200 mb-1">
            {isUploading ? uploadProgress : 'Drop gallery images here or click to browse'}
          </p>
          <p className="text-xs text-stone-500">
            Select multiple photos at once. Automatically compressed to WebP.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
        className="hidden"
      />

      {/* Photo List with Reordering and Captions */}
      {photos.length > 0 && (
        <div className="space-y-3 mt-4">
          {photos.map((photo, index) => (
            <div
              key={photo.storage_path || photo.image_url || index}
              className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-stone-900/70 border border-stone-800 rounded-xl hover:border-stone-700 transition-colors"
            >
              {/* Order Badge and Thumbnail */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="w-6 text-center text-xs font-semibold text-stone-500">
                  #{index + 1}
                </span>

                <div className="w-20 h-14 bg-stone-950 rounded-lg overflow-hidden flex-shrink-0 border border-stone-800">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || `Gallery photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Caption Input */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={photo.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="Photo caption (e.g. Early mist clearing over the valley)"
                  className="w-full px-3 py-2 bg-stone-950/80 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Action Controls: Move Up, Down, Remove */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-750 disabled:opacity-30 rounded-lg transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === photos.length - 1}
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-750 disabled:opacity-30 rounded-lg transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors ml-1"
                  title="Remove Photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
