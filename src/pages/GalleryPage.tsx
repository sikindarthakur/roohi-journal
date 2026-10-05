import React, { useEffect, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { Lightbox } from '@/components/common/Lightbox';
import { Photo, LightboxItem } from '@/types';
import { getAllPublishedPhotos } from '@/lib/photos';
import { Camera, Maximize2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<(Photo & { article_title?: string; article_slug?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getAllPublishedPhotos();
        setPhotos(data);
      } catch (err) {
        console.error('Error loading gallery photos:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, []);

  const handleOpenLightbox = (index: number) => {
    const items: LightboxItem[] = photos.map((p) => ({
      id: p.id,
      url: p.image_url,
      caption: p.caption,
      storyTitle: p.article_title,
      storySlug: p.article_slug,
    }));

    setLightboxItems(items);
    setCurrentLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0d11] pt-32 pb-24 px-6 sm:px-8">
      <SEO
        title="Photo Gallery • Visual Wall"
        description="A curated photo wall across all published journeys and destinations by Roohi."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 flex items-center justify-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            Visual Wall
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-stone-100 mb-6">
            The Gallery
          </h1>
          <p className="text-stone-400 text-sm sm:text-base font-light leading-relaxed">
            Moments frozen in time. An ongoing mosaic of landscapes, portraits, and quiet details captured across five continents.
          </p>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-stone-900/50 rounded-2xl aspect-[3/4] animate-pulse border border-stone-800/60"
              />
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {photos.map((photo, index) => (
              <figure
                key={photo.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative cursor-pointer break-inside-avoid rounded-2xl overflow-hidden bg-stone-900 border border-white/5 hover:border-amber-500/40 transition-all duration-500 hover:shadow-2xl"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Roohi photography'}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.caption && (
                      <figcaption className="font-serif italic text-sm text-stone-100 line-clamp-2 mb-2">
                        {photo.caption}
                      </figcaption>
                    )}
                    {photo.article_title && photo.article_slug && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                        <BookOpen className="w-3.5 h-3.5" />
                        <Link
                          to={`/stories/${photo.article_slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline tracking-wide"
                        >
                          {photo.article_title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-900/30 rounded-3xl border border-stone-800 p-8 max-w-md mx-auto">
            <h3 className="font-serif text-2xl text-stone-200 mb-2">Gallery is empty</h3>
            <p className="text-stone-400 text-xs">
              Photographs will appear here once stories are published.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={currentLightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(idx) => setCurrentLightboxIndex(idx)}
      />
    </main>
  );
};
