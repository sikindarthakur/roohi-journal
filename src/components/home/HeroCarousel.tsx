import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Article } from '@/types';

interface HeroCarouselProps {
  stories: Article[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = stories.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay management
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !isPlaying || isHovered || total <= 1) {
      return;
    }

    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, total, handleNext]);

  // Preload all carousel images in background for instant slide switching
  useEffect(() => {
    if (!stories || stories.length === 0) return;
    stories.forEach((story) => {
      if (story.cover_image_url) {
        const img = new Image();
        img.src = story.cover_image_url;
      }
    });
  }, [stories]);

  // Keyboard navigation on hero focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // HERO-8: Empty state handling
  if (total === 0) {
    return (
      <section className="relative w-full h-[75vh] min-h-[500px] flex items-center justify-center bg-stone-950 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-200 mb-4 font-light">
            Quiet Horizons
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed mb-6">
            New visual stories and photographic essays will be published here soon.
          </p>
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-stone-950 text-xs font-semibold tracking-widest uppercase hover:bg-amber-400 transition-colors"
          >
            Create First Story
          </Link>
        </div>
      </section>
    );
  }

  const currentStory = stories[currentIndex];
  const formattedDate = currentStory.published_at
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(currentStory.published_at))
    : null;

  return (
    <section
      className="relative w-full h-[88vh] sm:h-[92vh] min-h-[620px] max-h-[1050px] overflow-hidden bg-black select-none outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Photography Stories"
    >
      {/* Background Image Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-stone-950"
        >
          <img
            src={currentStory.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80'}
            alt={currentStory.cover_image_alt || currentStory.title}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
            className="w-full h-full object-cover object-center"
          />

          {/* Refined Cinematic Overlays: Crystal-clear imagery + high-contrast text legibility */}
          {/* 1. Subtle top vignette for navbar visibility */}
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* 2. Targeted left-to-right scrim directly under text for guaranteed contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 via-35% to-transparent sm:w-[65%] pointer-events-none" />

          {/* 3. Smooth bottom blend into page background */}
          <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11]/70 via-35% to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Layer */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="w-full">
          {/* Metadata: Location & Date */}
          <motion.div
            key={`meta-${currentStory.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium mb-3.5 sm:mb-4 max-w-2xl"
          >
            {currentStory.location && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {currentStory.location}
              </span>
            )}

            {formattedDate && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-stone-200 shadow-md">
                <Calendar className="w-3.5 h-3.5 opacity-80 text-amber-400" />
                {formattedDate}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            key={`title-${currentStory.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.15] sm:leading-[1.12] tracking-tight mb-4 sm:mb-5 max-w-3xl [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]"
          >
            {currentStory.title}
          </motion.h1>

          {/* Excerpt */}
          {currentStory.excerpt && (
            <motion.p
              key={`excerpt-${currentStory.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-stone-100 text-xs sm:text-base md:text-lg font-normal leading-relaxed mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 max-w-2xl [text-shadow:_0_1px_8px_rgba(0,0,0,0.95)]"
            >
              {currentStory.excerpt}
            </motion.p>
          )}

          {/* Bottom Action Row: READ STORY + Carousel Navigation on the exact same horizontal row */}
          <motion.div
            key={`controls-row-${currentStory.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-between gap-3 sm:gap-4 pt-2 w-full"
          >
            {/* Read Story CTA */}
            <Link
              to={`/stories/${currentStory.slug}`}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-amber-500/15 hover:shadow-amber-500/30 flex-shrink-0"
            >
              <span>Read Story</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 shrink-0" />
            </Link>

            {/* Carousel Navigation Pill */}
            {total > 1 && (
              <div className="flex items-center gap-2 sm:gap-4 bg-black/75 backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-3 rounded-full border border-white/10 shadow-2xl flex-shrink-0">
                {/* Pause / Play Autoplay Toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-0.5 sm:p-1 text-stone-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-1 focus:ring-amber-400"
                  aria-label={isPlaying ? 'Pause hero autoplay' : 'Start hero autoplay'}
                  title={isPlaying ? 'Pause Autoplay' : 'Play Autoplay'}
                >
                  {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                </button>

                <div className="h-3 w-[1px] bg-stone-700" />

                {/* Slide Indicator Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {stories.map((story, idx) => (
                    <button
                      key={story.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`transition-all duration-500 rounded-full focus:outline-none ${
                        idx === currentIndex
                          ? 'w-4 sm:w-6 h-1.5 bg-amber-400'
                          : 'w-1.5 h-1.5 bg-stone-500 hover:bg-stone-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}: ${story.title}`}
                      aria-current={idx === currentIndex ? 'true' : 'false'}
                    />
                  ))}
                </div>

                <div className="h-3 w-[1px] bg-stone-700" />

                {/* Prev / Next Arrows */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-0.5 text-stone-300 hover:text-white transition-colors rounded-full focus:outline-none"
                    aria-label="Previous story slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-0.5 text-stone-300 hover:text-white transition-colors rounded-full focus:outline-none"
                    aria-label="Next story slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

