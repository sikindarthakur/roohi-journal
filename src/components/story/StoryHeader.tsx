import React from 'react';
import { MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '@/types';

interface StoryHeaderProps {
  article: Article;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({ article }) => {
  const formattedDate = article.published_at
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(article.published_at))
    : 'Draft Story';

  // Calculate estimated reading time
  const wordCount = (article.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <header className="relative w-full min-h-[70vh] sm:min-h-[82vh] flex flex-col justify-between overflow-hidden bg-stone-950">
      {/* Full-width Cover Image with cinematic background overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={article.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85'}
          alt={article.cover_image_alt || article.title}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        {/* Refined Cinematic Overlays: Crystal clear visuals + smooth text contrast */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 via-35% to-transparent sm:w-[65%] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11]/70 via-35% to-transparent pointer-events-none" />
      </div>

      {/* Top Bar Navigation */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-6 sm:px-8 pt-28 sm:pt-32">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-stone-300 hover:text-white border border-white/10 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Stories</span>
        </Link>
      </div>

      {/* Hero Content Information */}
      <div className="relative z-20 max-w-4xl mx-auto w-full px-6 sm:px-8 pb-16 sm:pb-24 text-center sm:text-left">
        {/* Metadata badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs uppercase tracking-[0.2em] font-medium text-amber-400 mb-6">
          {article.location && (
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {article.location}
            </span>
          )}

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-stone-200">
            <Calendar className="w-3.5 h-3.5 opacity-80 text-amber-400" />
            {formattedDate}
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-stone-200">
            <Clock className="w-3.5 h-3.5 opacity-80 text-amber-400" />
            {readingTime} min read
          </span>
        </div>

        {/* Story Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.15] tracking-tight mb-6 [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="font-serif italic text-lg sm:text-2xl text-stone-100 max-w-2xl leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.95)]">
            {article.excerpt}
          </p>
        )}
      </div>
    </header>
  );
};
