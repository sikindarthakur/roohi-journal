import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LightboxItem } from '@/types';

interface LightboxProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  items,
  currentIndex,
  onClose,
  onIndexChange,
}) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentItem = items[currentIndex];
  const total = items.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onIndexChange((currentIndex + 1) % total);
  }, [currentIndex, total, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onIndexChange((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onIndexChange]);

  // Save focused trigger element and restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the lightbox modal
      setTimeout(() => {
        containerRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Photo Lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl outline-none select-none"
      >
        {/* Top Controls Bar */}
        <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/80 to-transparent">
          {/* Counter */}
          <div className="text-xs sm:text-sm font-medium tracking-[0.2em] text-stone-300">
            <span className="text-amber-400 font-semibold">{currentIndex + 1}</span>
            <span className="text-stone-500 mx-2">/</span>
            <span>{total}</span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Button */}
        {total > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-stone-900/70 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/50 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 transform hover:scale-105"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Stage with Swipe / Drag */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-12">
          <motion.div
            key={currentItem.id || currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -100 || offset.x < -100) {
                handleNext();
              } else if (swipe > 100 || offset.x > 100) {
                handlePrev();
              }
            }}
            className="relative max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <img
              src={currentItem.url}
              alt={currentItem.caption || 'Full view photograph'}
              className="max-h-[78vh] max-w-full object-contain rounded-sm shadow-2xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] pointer-events-none"
            />
          </motion.div>

          {/* Bottom Caption & Story Link */}
          {(currentItem.caption || currentItem.storyTitle) && (
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 mx-auto max-w-2xl px-6 text-center z-40">
              <div className="inline-block bg-stone-900/85 backdrop-blur-md border border-stone-700/60 rounded-xl px-5 py-3 shadow-xl">
                {currentItem.caption && (
                  <p className="font-serif italic text-sm sm:text-base text-stone-200 leading-relaxed">
                    {currentItem.caption}
                  </p>
                )}
                {currentItem.storyTitle && currentItem.storySlug && (
                  <div className="mt-1.5 pt-1.5 border-t border-stone-800 flex items-center justify-center gap-2 text-xs text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <Link
                      to={`/stories/${currentItem.storySlug}`}
                      onClick={onClose}
                      className="hover:underline font-medium tracking-wide"
                    >
                      From story: {currentItem.storyTitle}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        {total > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-stone-900/70 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/50 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 transform hover:scale-105"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
