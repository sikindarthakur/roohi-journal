import React, { useEffect, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { ArticleCard } from '@/components/common/ArticleCard';
import { Article } from '@/types';
import { getAllPublishedStories } from '@/lib/articles';
import { Search, Compass } from 'lucide-react';

export const Stories: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const { articles: data } = await getAllPublishedStories(1, 50);
        setArticles(data);
      } catch (err) {
        console.error('Error loading stories:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, []);

  const filteredArticles = articles.filter((story) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      story.title.toLowerCase().includes(q) ||
      (story.location && story.location.toLowerCase().includes(q)) ||
      (story.excerpt && story.excerpt.toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen bg-[#0b0d11] pt-32 pb-24 px-6 sm:px-8">
      <SEO
        title="Stories & Photographic Essays"
        description="Browse all published travel stories, field journals, and photography chronicles by Roohi."
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5" />
            The Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-stone-100 mb-6">
            Travel Chronicles
          </h1>
          <p className="text-stone-400 text-sm sm:text-base font-light leading-relaxed">
            Explorations across rugged coastlines, mist-cloaked peaks, and historic alleyways. Each story is an ode to slow journeying and visual poetry.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-md mx-auto mb-16 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories by location or keyword..."
            className="w-full pl-11 pr-4 py-3 bg-[#13161f] border border-stone-800 rounded-full text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-lg"
          />
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-stone-900/40 border border-stone-800/60 aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-900/30 rounded-3xl border border-stone-800/80 p-8 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl text-stone-200 mb-2">No stories found</h3>
            <p className="text-stone-400 text-xs">
              {searchQuery ? `No results matching "${searchQuery}".` : 'No published stories yet.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
