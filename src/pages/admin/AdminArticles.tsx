import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { Article } from '@/types';
import { getAllArticlesForAdmin, togglePublishArticle, deleteArticle } from '@/lib/articles';
import {
  PlusCircle,
  Search,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'published_at'>('updated_at');
  const [sortAsc, setSortAsc] = useState(false);

  // Deletion state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleTogglePublish = async (article: Article) => {
    try {
      const updated = await togglePublishArticle(article.id, !article.published);
      setArticles((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, published: updated.published, published_at: updated.published_at } : a))
      );
    } catch (err: any) {
      alert(`Could not toggle status: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteArticle(storyToDelete.id);
      setArticles((prev) => prev.filter((a) => a.id !== storyToDelete.id));
      setDeleteModalOpen(false);
      setStoryToDelete(null);
    } catch (err: any) {
      alert(`Could not delete story: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sort
  const filteredArticles = articles
    .filter((article) => {
      if (statusFilter === 'published' && !article.published) return false;
      if (statusFilter === 'draft' && article.published) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        (article.location && article.location.toLowerCase().includes(q)) ||
        article.slug.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortBy] || a.created_at || 0).getTime();
      const dateB = new Date(b[sortBy] || b.created_at || 0).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  return (
    <AdminLayout>
      <SEO title="Manage Stories • Studio Control" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500 mb-1 block">
            Content Manager
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
            Stories & Articles
          </h1>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Story</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#11141c] border border-stone-800 rounded-xl self-start">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
              statusFilter === 'published'
                ? 'bg-emerald-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Published ({articles.filter((a) => a.published).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
              statusFilter === 'draft'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Drafts ({articles.filter((a) => !a.published).length})
          </button>
        </div>

        {/* Search Bar & Sort Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full pl-9 pr-3 py-2 bg-[#11141c] border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => {
              if (sortBy === 'updated_at') {
                setSortBy('published_at');
              } else {
                setSortBy('updated_at');
              }
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 bg-[#11141c] hover:bg-stone-850 border border-stone-800 rounded-xl text-xs text-stone-300 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            title="Toggle sort column and direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort: {sortBy === 'updated_at' ? 'Updated' : 'Date'} ({sortAsc ? 'Asc' : 'Desc'})</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#11141c] border border-stone-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 bg-stone-900/50">
              <th className="py-4 px-6 font-semibold">Story</th>
              <th className="py-4 px-4 font-semibold">Status</th>
              <th className="py-4 px-4 font-semibold">Location</th>
              <th className="py-4 px-4 font-semibold">Published</th>
              <th className="py-4 px-4 font-semibold">Last Updated</th>
              <th className="py-4 px-6 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 text-xs text-stone-300">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-500">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading stories...
                </td>
              </tr>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-stone-900/40 transition-colors">
                  {/* Story Title & Cover */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-950 flex-shrink-0 border border-stone-800">
                        <img
                          src={article.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80'}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <div className="font-medium text-stone-100 truncate text-sm">
                          {article.title}
                        </div>
                        <div className="text-stone-500 text-[11px] truncate">
                          /{article.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        article.published
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {article.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{article.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4 text-stone-400">
                    {article.location || '—'}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-stone-400">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString() : '—'}
                  </td>

                  {/* Updated */}
                  <td className="py-4 px-4 text-stone-500">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/stories/${article.slug}${!article.published ? '?preview=true' : ''}`}
                        target="_blank"
                        className="p-2 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-750 rounded-lg transition-colors"
                        title="Preview Story"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-stone-400 hover:text-amber-400 bg-stone-800/80 hover:bg-stone-750 rounded-lg transition-colors"
                        title="Edit Story"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          setStoryToDelete(article);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete Story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-500">
                  No stories match the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Layout (Section 8.10 & 13) */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-stone-500">Loading stories...</div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-[#11141c] border border-stone-800 rounded-2xl p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-stone-950 flex-shrink-0 border border-stone-800">
                  <img
                    src={article.cover_image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        article.published
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </button>
                  </div>
                  <h3 className="text-sm font-medium text-stone-100 truncate">{article.title}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-2 border-t border-stone-800/60">
                {article.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {article.location}
                  </span>
                )}
                {article.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-500" />
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/60">
                <Link
                  to={`/stories/${article.slug}${!article.published ? '?preview=true' : ''}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Link>

                <Link
                  to={`/admin/articles/${article.id}/edit`}
                  className="px-3 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Link>

                <button
                  onClick={() => {
                    setStoryToDelete(article);
                    setDeleteModalOpen(true);
                  }}
                  className="p-1.5 text-red-400 bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-stone-900/30 rounded-2xl border border-stone-800 p-6 text-stone-500 text-xs">
            No stories match your search.
          </div>
        )}
      </div>

      {/* Confirmation Modal for Permanent Deletion */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Story Permanently"
        message={`Are you sure you want to delete "${storyToDelete?.title}"? This action cannot be undone. All attached gallery photographs and stored image files will be permanently removed.`}
        confirmLabel="Delete Story"
        cancelLabel="Keep Story"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setStoryToDelete(null);
        }}
      />
    </AdminLayout>
  );
};
