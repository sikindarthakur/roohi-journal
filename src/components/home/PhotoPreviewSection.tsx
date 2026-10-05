import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { Photo, LightboxItem } from '@/types';

interface PhotoPreviewSectionProps {
  photos: (Photo & { article_title?: string; article_slug?: string })[];
  onOpenLightbox: (items: LightboxItem[], index: number) => void;
}

export const PhotoPreviewSection: React.FC<PhotoPreviewSectionProps> = ({
  photos,
  onOpenLightbox,
}) => {
  if (photos.length === 0) return null;

  // 12 photos for a perfectly balanced 3-row grid (3 rows × 4 columns on Desktop, 6 rows × 2 columns on Mobile)
  const displayPhotos = photos.slice(0, 12);

  const lightboxItems: LightboxItem[] = displayPhotos.map((p) => ({
    id: p.id,
    url: p.image_url,
    caption: p.caption,
    storyTitle: p.article_title,
    storySlug: p.article_slug,
  }));

  return (
    <section className="py-24 sm:py-32 bg-[#080a0d] border-y border-stone-900 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-stone-800/80">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 block">
              Curated Frames
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-100">
              Photography Preview
            </h2>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-stone-400 hover:text-amber-400 transition-colors mt-4 md:mt-0"
          >
            <span>Explore Full Wall</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Uniform, Equal-Shape Grid (3 rows × 4 columns on Desktop, 6 rows × 2 columns on Tablet/Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => onOpenLightbox(lightboxItems, index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-900 cursor-pointer border border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              <img
                src={photo.image_url}
                alt={photo.caption || 'Travel photograph'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Dark Hover Overlay with Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.caption && (
                    <p className="font-serif italic text-xs sm:text-sm text-stone-100 line-clamp-2 mb-1">
                      {photo.caption}
                    </p>
                  )}
                  {photo.article_title && (
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-400 block font-medium truncate">
                      {photo.article_title}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
