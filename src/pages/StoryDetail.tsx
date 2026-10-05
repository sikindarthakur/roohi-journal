import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { StoryHeader } from '@/components/story/StoryHeader';
import { StoryBody } from '@/components/story/StoryBody';
import { StoryGallery } from '@/components/story/StoryGallery';
import { Lightbox } from '@/components/common/Lightbox';
import { ArticleWithPhotos, LightboxItem } from '@/types';
import { getArticleBySlug } from '@/lib/articles';
import { useAuth } from '@/hooks/useAuth';
import { Eye, ArrowLeft } from 'lucide-react';

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState<ArticleWithPhotos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error404, setError404] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadStory() {
      if (!slug) return;
      setIsLoading(true);
      setError404(false);

      try {
        const allowDraft = isPreview && isAuthenticated;
        const data = await getArticleBySlug(slug, allowDraft || isAuthenticated);

        if (!data) {
          setError404(true);
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error('Error fetching story:', err);
        setError404(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadStory();
  }, [slug, isPreview, isAuthenticated]);

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
          <span className="text-xs uppercase tracking-widest text-stone-400">Loading Story...</span>
        </div>
      </div>
    );
  }

  if (error404 || !article) {
    return (
      <main className="min-h-screen bg-[#0b0d11] flex items-center justify-center px-6 py-32 text-center">
        <div className="max-w-md mx-auto">
          <span className="font-cinzel text-5xl text-stone-600 block mb-4">404</span>
          <h1 className="font-serif text-3xl text-stone-100 mb-3">Story Not Found</h1>
          <p className="text-stone-400 text-sm mb-8 leading-relaxed">
            The photographic essay you are looking for does not exist or remains an unpublished draft.
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-stone-950 text-xs font-semibold tracking-widest uppercase hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Stories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0d11] selection:bg-amber-500/30 selection:text-amber-200">
      <SEO
        title={article.title}
        description={article.excerpt || `${article.title} - A photo story by Roohi.`}
        image={article.cover_image_url}
        type="article"
      />

      {/* Admin Draft Preview Notice */}
      {!article.published && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <Eye className="w-4 h-4" />
          <span>Draft Preview Mode — This story is not visible to public visitors.</span>
          <Link to={`/admin/articles/${article.id}/edit`} className="underline ml-2 hover:text-amber-200">
            Edit in Admin
          </Link>
        </div>
      )}

      {/* Header with Cover, Title, and Metadata */}
      <StoryHeader article={article} />

      {/* Rich-Text Editorial Body */}
      <StoryBody content={article.content} />

      {/* Bottom Photo Gallery */}
      <StoryGallery
        photos={article.photos}
        storyTitle={article.title}
        storySlug={article.slug}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Lightbox for Gallery */}
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
