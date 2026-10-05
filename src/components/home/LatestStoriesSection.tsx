import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/common/ArticleCard';

interface LatestStoriesSectionProps {
  stories: Article[];
}

export const LatestStoriesSection: React.FC<LatestStoriesSectionProps> = ({ stories }) => {
  if (stories.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-stone-800/80">
        <div>
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 block">
            Visual Dispatches
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-100">
            Latest Stories
          </h2>
        </div>

        <Link
          to="/stories"
          className="group inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-stone-400 hover:text-amber-400 transition-colors mt-4 md:mt-0"
        >
          <span>All Published Stories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {stories.map((story) => (
          <ArticleCard key={story.id} article={story} />
        ))}
      </div>
    </section>
  );
};
