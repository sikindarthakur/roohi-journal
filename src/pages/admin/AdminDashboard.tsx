import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats, Article } from '@/types';
import { getDashboardStats, getAllArticlesForAdmin } from '@/lib/articles';
import {
  BookOpen,
  CheckCircle2,
  FileEdit,
  Camera,
  PlusCircle,
  ArrowRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalPhotos: 0,
  });
  const [recentStories, setRecentStories] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, articles] = await Promise.all([
          getDashboardStats(),
          getAllArticlesForAdmin(),
        ]);
        setStats(statsData);
        setRecentStories(articles.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <SEO title="Dashboard • Studio Control" />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500 mb-1 block">
            Studio Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
            Roohi's Dashboard
          </h1>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Story</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {/* Total Stories */}
        <div className="p-6 bg-[#11141c] border border-stone-800/80 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Total Stories</span>
            <div className="p-2 rounded-lg bg-stone-800 text-stone-300">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-stone-100">
            {isLoading ? '...' : stats.totalStories}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Across all journals</span>
        </div>

        {/* Published */}
        <div className="p-6 bg-[#11141c] border border-stone-800/80 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Published</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-emerald-400">
            {isLoading ? '...' : stats.publishedStories}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Live on public journal</span>
        </div>

        {/* Drafts */}
        <div className="p-6 bg-[#11141c] border border-stone-800/80 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">Drafts</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-amber-400">
            {isLoading ? '...' : stats.draftStories}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">Unpublished essays</span>
        </div>

        {/* Total Photos */}
        <div className="p-6 bg-[#11141c] border border-stone-800/80 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">Total Photos</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-purple-400">
            {isLoading ? '...' : stats.totalPhotos}
          </div>
          <span className="text-xs text-stone-500 mt-1 block">In galleries & walls</span>
        </div>
      </div>

      {/* Recent Stories Shortcut Table */}
      <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
          <div>
            <h2 className="text-base font-semibold text-stone-100">Recent Stories</h2>
            <p className="text-xs text-stone-400">Quickly review and edit recent submissions</p>
          </div>
          <Link
            to="/admin/articles"
            className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-stone-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentStories.length > 0 ? (
          <div className="space-y-3">
            {recentStories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-950 flex-shrink-0 border border-stone-800">
                    <img
                      src={story.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          story.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {story.published ? 'Published' : 'Draft'}
                      </span>

                      {story.location && (
                        <span className="text-xs text-stone-400 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          {story.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-stone-200 truncate">{story.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {story.published && (
                    <Link
                      to={`/stories/${story.slug}`}
                      target="_blank"
                      className="p-2 text-stone-400 hover:text-white bg-stone-800/70 hover:bg-stone-750 rounded-lg transition-colors"
                      title="View live story"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <Link
                    to={`/admin/articles/${story.id}/edit`}
                    className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-stone-400 text-sm mb-4">No stories written yet.</p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-stone-950 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-amber-400"
            >
              Write First Story
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
