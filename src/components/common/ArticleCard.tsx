import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  eager?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, eager = false }) => {
  const formattedDate = article.published_at
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(article.published_at))
    : null;

  return (
    <article className="group flex flex-col bg-[#12151c]/70 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1">
      {/* Cover Image Container */}
      <Link
        to={`/stories/${article.slug}`}
        className="relative aspect-[16/10] overflow-hidden bg-stone-900 block"
      >
        <img
          src={article.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
          alt={article.cover_image_alt || article.title}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Location Tag */}
        {article.location && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-xs font-medium border border-white/10">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{article.location}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          {/* Date */}
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-stone-400 uppercase tracking-widest font-medium mb-3">
              <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
              <span>{formattedDate}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-3">
            <Link to={`/stories/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <Link
            to={`/stories/${article.slug}`}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-amber-400 group-hover:text-amber-300 transition-colors"
          >
            <span>Read Story</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
