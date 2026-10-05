import { supabase, isSupabaseConfigured } from './supabase';
import { StorageUploadResult, ImageTransformOptions } from '@/types';
import { idbGet, idbSet, idbDelete } from './idb';

const BUCKET_NAME = 'photography';

/**
 * Compresses and converts an image file to WebP client-side
 */
export async function processImageFile(file: File, maxDimension = 2560, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    // If SVG or gif or already small webp, return file directly
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return resolve(file);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads an image to storage abstraction
 */
export async function uploadImage(
  file: File,
  storagePath: string,
  options?: ImageTransformOptions
): Promise<StorageUploadResult> {
  // Process image client-side to WebP & optimized dimension
  const processedBlob = await processImageFile(
    file,
    options?.width || 2560,
    options?.quality || 0.85
  );

  // Normalize path extension to .webp if converted
  const cleanPath = storagePath.replace(/\.[^/.]+$/, "") + ".webp";

  if (!isSupabaseConfigured) {
    // Convert blob to DataURL and store in IndexedDB
    const localDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(processedBlob);
    });

    const mockStorageKey = `roohi_storage_${cleanPath}`;
    await idbSet(mockStorageKey, localDataUrl);

    return {
      url: localDataUrl,
      path: cleanPath,
    };
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(cleanPath, processedBlob, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(cleanPath);

  return {
    url: publicUrlData.publicUrl,
    path: cleanPath,
  };
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(storagePath: string): Promise<void> {
  if (!storagePath) return;

  if (!isSupabaseConfigured) {
    const mockStorageKey = `roohi_storage_${storagePath}`;
    await idbDelete(mockStorageKey);
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    console.warn(`Could not delete storage image ${storagePath}:`, error.message);
  }
}

/**
 * Gets the public URL for an image path
 */
export async function getImageUrl(storagePath: string, _options?: ImageTransformOptions): Promise<string> {
  if (!storagePath) return '';
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://') || storagePath.startsWith('data:')) {
    return storagePath;
  }

  if (!isSupabaseConfigured) {
    const mockStorageKey = `roohi_storage_${storagePath}`;
    const localUrl = await idbGet<string>(mockStorageKey);
    return localUrl || storagePath;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data.publicUrl;
}
