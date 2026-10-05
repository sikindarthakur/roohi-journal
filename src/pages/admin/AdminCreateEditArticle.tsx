import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { SEO } from '@/components/common/SEO';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { GalleryManager, GalleryPhotoItem } from '@/components/admin/GalleryManager';
import { createArticle, updateArticle, getArticleById, generateSlug } from '@/lib/articles';
import {
  Save,
  Send,
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminCreateEditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [location, setLocation] = useState('');
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().split('T')[0]);
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [content, setContent] = useState('');
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // Status State
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing article for edit
  useEffect(() => {
    if (!isEditing || !id) return;

    async function loadStory() {
      try {
        const article = await getArticleById(id!);
        if (!article) {
          setErrorMsg('Story not found');
          return;
        }

        setTitle(article.title);
        setSlug(article.slug);
        setSlugManuallyEdited(true);
        setLocation(article.location || '');
        if (article.published_at) {
          setPublishedAt(new Date(article.published_at).toISOString().split('T')[0]);
        }
        setExcerpt(article.excerpt || '');
        setCoverImageUrl(article.cover_image_url);
        setCoverImageAlt(article.cover_image_alt || '');
        setContent(article.content || '');
        setIsPublished(article.published);

        if (article.photos) {
          setGalleryPhotos(
            article.photos.map((p) => ({
              image_url: p.image_url,
              storage_path: p.storage_path || undefined,
              caption: p.caption || undefined,
              sort_order: p.sort_order,
            }))
          );
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading story');
      } finally {
        setIsLoading(false);
      }
    }

    loadStory();
  }, [id, isEditing]);

  // Auto-generate slug from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHasUnsavedChanges(true);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setSlugManuallyEdited(true);
    setHasUnsavedChanges(true);
  };

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save / Publish Handler
  const handleSave = useCallback(
    async (shouldPublish: boolean) => {
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!title.trim()) {
        setErrorMsg('Please enter a story title.');
        return;
      }

      // Validation for publishing (FR-EDIT)
      if (shouldPublish) {
        if (!coverImageUrl) {
          setErrorMsg('A cover photograph is required before publishing a story.');
          return;
        }
        if (!content || content.replace(/<[^>]+>/g, '').trim().length < 10) {
          setErrorMsg('Story content is required before publishing.');
          return;
        }
      }

      setIsSaving(true);

      try {
        const articlePayload = {
          title: title.trim(),
          slug: slug.trim() ? generateSlug(slug) : generateSlug(title),
          location: location.trim() || null,
          published_at: shouldPublish || isPublished ? new Date(publishedAt).toISOString() : null,
          excerpt: excerpt.trim() || null,
          cover_image_url: coverImageUrl,
          cover_image_alt: coverImageAlt.trim() || null,
          content: content || null,
          published: shouldPublish ? true : isPublished,
          galleryPhotos,
        };

        let savedArticle;
        if (isEditing && id) {
          savedArticle = await updateArticle(id, articlePayload);
        } else {
          savedArticle = await createArticle(articlePayload);
        }

        setHasUnsavedChanges(false);

        if (shouldPublish) {
          // Confetti celebration on publish
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#ffffff'],
            });
          } catch {}

          setSuccessMsg('Story successfully published! It is now live in the journal and hero carousel.');
          setIsPublished(true);
        } else {
          setSuccessMsg('Draft saved successfully.');
        }

        // If newly created, transition to edit route
        if (!isEditing && savedArticle) {
          navigate(`/admin/articles/${savedArticle.id}/edit`, { replace: true });
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to save story.');
      } finally {
        setIsSaving(false);
      }
    },
    [
      title,
      slug,
      location,
      publishedAt,
      excerpt,
      coverImageUrl,
      coverImageAlt,
      content,
      isPublished,
      galleryPhotos,
      isEditing,
      id,
      navigate,
    ]
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-xs uppercase tracking-widest text-stone-400">Loading Story Editor...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title={isEditing ? `Edit: ${title || 'Story'} • Studio` : 'New Story • Studio'} />

      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
        <div>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Stories
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
              {isEditing ? 'Edit Story' : 'Compose New Story'}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isPublished
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {slug && (
            <Link
              to={`/stories/${slug}?preview=true`}
              target="_blank"
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-750 text-stone-200 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPublished ? 'Update & Publish' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-400 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-emerald-400 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
        {/* Title and Metadata Section */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-500 mb-2">
            Essential Details
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Story Title <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Monsoon Reverie Along the Hooghly: The Ghats of North Kolkata"
              className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 font-serif text-lg sm:text-xl placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Slug & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                URL Slug <span className="text-stone-500 font-normal">(/stories/slug)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="monsoon-reverie-along-the-hooghly"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="e.g. Kumartuli & Bagbazar Ghat, Kolkata, West Bengal"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Publication Date & Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Publication Date */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Publication Date
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPublishedAt(new Date().toISOString().split('T')[0]);
                    setHasUnsavedChanges(true);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Set to Today
                </button>
              </div>
              <div
                onClick={(e) => {
                  const input = (e.currentTarget.querySelector('input[type="date"]') as any);
                  try {
                    input?.showPicker?.();
                  } catch {}
                }}
                className="relative cursor-pointer"
              >
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => {
                    setPublishedAt(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  onClick={(e) => {
                    try {
                      (e.target as any).showPicker?.();
                    } catch {}
                  }}
                  style={{ colorScheme: 'dark' }}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 cursor-pointer focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Stories are ordered chronologically by this date in the hero carousel and stories archive.
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Summary Excerpt <span className="text-stone-500 font-normal">(Auto-generated if empty)</span>
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Brief summary for story cards and SEO meta tags"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Cover Photograph Section (Hero & Card cover) */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-500 mb-2">
            Story Cover Photograph
          </h2>
          <p className="text-xs text-stone-400">
            This image is featured as the full-width header on the story page, hero carousel, and social media preview cards.
          </p>

          <ImageUploader
            value={coverImageUrl}
            onChange={(url) => {
              setCoverImageUrl(url);
              setHasUnsavedChanges(true);
            }}
            storagePathPrefix={`articles/${id || 'draft'}`}
            label="Cover Photograph"
            altText={coverImageAlt}
            onAltTextChange={(alt) => {
              setCoverImageAlt(alt);
              setHasUnsavedChanges(true);
            }}
            required={true}
          />
        </div>

        {/* Rich-Text Content Section */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-500 mb-1">
                Story Manuscript
              </h2>
              <p className="text-xs text-stone-400">
                Write your travel essay with rich formatting, quotes, and inline illustrations.
              </p>
            </div>
          </div>

          <RichTextEditor
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              setHasUnsavedChanges(true);
            }}
            placeholder="Describe the journey, sensory moments, morning light, and encounters..."
          />
        </div>

        {/* Gallery Section */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-500 mb-2">
            Story Photo Gallery
          </h2>
          <p className="text-xs text-stone-400">
            Upload multiple high-resolution photos that will appear in the story's bottom gallery grid and full-screen lightbox.
          </p>

          <GalleryManager
            photos={galleryPhotos}
            onChange={(photos) => {
              setGalleryPhotos(photos);
              setHasUnsavedChanges(true);
            }}
            articleIdPrefix={id || 'draft'}
          />
        </div>

        {/* Bottom Bar Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-stone-800">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-6 py-3 bg-stone-850 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-amber-500/15 hover:shadow-amber-500/30 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isPublished ? 'Save & Update' : 'Publish Story'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
