import React, { useEffect, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { LatestStoriesSection } from '@/components/home/LatestStoriesSection';
import { PhotoPreviewSection } from '@/components/home/PhotoPreviewSection';
import { AboutTeaserSection } from '@/components/home/AboutTeaserSection';
import { Lightbox } from '@/components/common/Lightbox';
import { Article, Photo, LightboxItem } from '@/types';
import { getHeroStories, getLatestStories } from '@/lib/articles';
import { getAllPublishedPhotos } from '@/lib/photos';

export const Home: React.FC = () => {
  const [heroStories, setHeroStories] = useState<Article[]>([]);
  const [latestStories, setLatestStories] = useState<Article[]>([]);
  const [photos, setPhotos] = useState<(Photo & { article_title?: string; article_slug?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [hero, latest, allPhotos] = await Promise.all([
          getHeroStories(),
          getLatestStories(6),
          getAllPublishedPhotos(),
        ]);
        setHeroStories(hero);
        setLatestStories(latest);
        setPhotos(allPhotos);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleOpenLightbox = (items: LightboxItem[], index: number) => {
    setLightboxItems(items);
    setCurrentLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-stone-400">Opening Journal...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0d11]">
      <SEO
        title="Roohi • Photography & Travel Journal"
        description="A cinematic visual diary where photography, slow travel, and editorial storytelling come together."
      />

      {/* Hero Section (Latest 5 published stories) */}
      <HeroCarousel stories={heroStories} />

      {/* Latest Stories Card Grid */}
      <LatestStoriesSection stories={latestStories} />

      {/* Photography Preview Section */}
      <PhotoPreviewSection photos={photos} onOpenLightbox={handleOpenLightbox} />

      {/* About Teaser Section */}
      <AboutTeaserSection />

      {/* Global Lightbox Component */}
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
