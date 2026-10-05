import React from 'react';
import { Maximize2, Camera } from 'lucide-react';
import { Photo, LightboxItem } from '@/types';

interface StoryGalleryProps {
  photos: Photo[];
  storyTitle: string;
  storySlug: string;
  onOpenLightbox: (items: LightboxItem[], index: number) => void;
}

export const StoryGallery: React.FC<StoryGalleryProps> = ({
  photos,
  storyTitle,
  storySlug,
  onOpenLightbox,
}) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  const sortedPhotos = [...photos].sort((a, b) => a.sort_order - b.sort_order);

  const lightboxItems: LightboxItem[] = sortedPhotos.map((p) => ({
    id: p.id,
    url: p.image_url,
    caption: p.caption,
    storyTitle,
    storySlug,
  }));

  return (
    <section className="bg-[#080a0e] border-t border-stone-900 py-20 sm:py-28 px-6 sm:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 flex items-center justify-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            Visual Archive
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-100 mb-4">
            Photo Gallery
          </h2>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            High-resolution captures and quiet moments from this journey. Click any photograph to expand in cinematic full-screen.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedPhotos.map((photo, index) => (
            <figure
              key={photo.id}
              onClick={() => onOpenLightbox(lightboxItems, index)}
              className="group relative cursor-pointer bg-stone-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={photo.image_url}
                  alt={photo.caption || `${storyTitle} photograph ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                {photo.caption && (
                  <figcaption className="font-serif italic text-sm text-stone-100 line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.caption}
                  </figcaption>
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
