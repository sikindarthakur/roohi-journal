import { supabase, isSupabaseConfigured } from './supabase';
import { Article, ArticleWithPhotos, DashboardStats } from '@/types';
import { initialArticles } from './mockData';
import { getPhotosByArticleId, savePhotos, getMockPhotos } from './photos';
import { deleteImage } from './storage';
import { idbGet, idbSet } from './idb';

const MOCK_ARTICLES_KEY = 'roohi_articles_data';

export async function getMockArticles(): Promise<Article[]> {
  const saved = await idbGet<Article[]>(MOCK_ARTICLES_KEY);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    return saved;
  }
  await idbSet(MOCK_ARTICLES_KEY, initialArticles);
  return initialArticles;
}

export async function setMockArticles(articles: Article[]): Promise<void> {
  await idbSet(MOCK_ARTICLES_KEY, articles);
}

/**
 * Generates a clean URL slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Strips HTML tags and extracts a clean excerpt
 */
export function extractExcerptFromHtml(html: string, maxLength = 160): string {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * HERO-1: Latest 5 published stories ordered by published_at DESC, LIMIT 5
 */
export async function getHeroStories(): Promise<Article[]> {
  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    return all
      .filter((a) => a.published)
      .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
      .slice(0, 5);
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching hero stories:', error);
    return [];
  }

  return data as Article[];
}

/**
 * Latest published stories for homepage grid
 */
export async function getLatestStories(limit = 6): Promise<Article[]> {
  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    return all
      .filter((a) => a.published)
      .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest stories:', error);
    return [];
  }

  return data as Article[];
}

/**
 * Paginated published stories for /stories list
 */
export async function getAllPublishedStories(page = 1, pageSize = 12): Promise<{ articles: Article[]; total: number }> {
  if (!isSupabaseConfigured) {
    const allArticles = await getMockArticles();
    const all = allArticles
      .filter((a) => a.published)
      .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
    
    const start = (page - 1) * pageSize;
    return {
      articles: all.slice(start, start + pageSize),
      total: all.length,
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching stories:', error);
    return { articles: [], total: 0 };
  }

  return {
    articles: data as Article[],
    total: count || 0,
  };
}

/**
 * Get article by slug (with attached photos)
 */
export async function getArticleBySlug(slug: string, allowDraft = false): Promise<ArticleWithPhotos | null> {
  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    const article = all.find((a) => a.slug === slug);
    if (!article) return null;
    if (!article.published && !allowDraft) return null;

    const photos = await getPhotosByArticleId(article.id);
    return {
      ...article,
      photos,
    };
  }

  let query = supabase
    .from('articles')
    .select('*')
    .eq('slug', slug);

  if (!allowDraft) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  const photos = await getPhotosByArticleId(data.id);

  return {
    ...data,
    photos,
  } as ArticleWithPhotos;
}

/**
 * Get article by ID for editing
 */
export async function getArticleById(id: string): Promise<ArticleWithPhotos | null> {
  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    const article = all.find((a) => a.id === id);
    if (!article) return null;

    const photos = await getPhotosByArticleId(article.id);
    return {
      ...article,
      photos,
    };
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const photos = await getPhotosByArticleId(id);

  return {
    ...data,
    photos,
  } as ArticleWithPhotos;
}

/**
 * Get all articles for Admin table
 */
export async function getAllArticlesForAdmin(): Promise<Article[]> {
  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    return all.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin articles:', error);
    return [];
  }

  return data as Article[];
}

/**
 * Ensure slug is unique by appending number suffix if needed
 */
async function ensureUniqueSlug(baseSlug: string, currentArticleId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  if (!isSupabaseConfigured) {
    const articles = await getMockArticles();
    while (articles.some((a) => a.slug === slug && a.id !== currentArticleId)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    return slug;
  }

  while (true) {
    let query = supabase.from('articles').select('id').eq('slug', slug);
    if (currentArticleId) {
      query = query.neq('id', currentArticleId);
    }
    const { data } = await query;
    if (!data || data.length === 0) {
      return slug;
    }
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

/**
 * Create a new article
 */
export async function createArticle(
  articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'> & { galleryPhotos?: { image_url: string; storage_path?: string; caption?: string; sort_order: number }[] }
): Promise<Article> {
  const baseSlug = articleData.slug ? generateSlug(articleData.slug) : generateSlug(articleData.title);
  const finalSlug = await ensureUniqueSlug(baseSlug);

  const excerpt = articleData.excerpt?.trim() 
    ? articleData.excerpt 
    : extractExcerptFromHtml(articleData.content || '');

  const publishedAt = articleData.published
    ? articleData.published_at || new Date().toISOString()
    : null;

  const newId = `art-${Date.now()}`;
  const now = new Date().toISOString();

  const newArticle: Article = {
    id: newId,
    title: articleData.title,
    slug: finalSlug,
    excerpt: excerpt || null,
    content: articleData.content || null,
    location: articleData.location || null,
    cover_image_url: articleData.cover_image_url || null,
    cover_image_alt: articleData.cover_image_alt || null,
    published: Boolean(articleData.published),
    published_at: publishedAt,
    created_at: now,
    updated_at: now,
  };

  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    const updated = [newArticle, ...all];
    await setMockArticles(updated);

    if (articleData.galleryPhotos && articleData.galleryPhotos.length > 0) {
      const formattedPhotos = articleData.galleryPhotos.map((p) => ({
        image_url: p.image_url,
        storage_path: p.storage_path || null,
        caption: p.caption || null,
        sort_order: p.sort_order,
      }));
      await savePhotos(newId, formattedPhotos);
    }

    return newArticle;
  }

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: newArticle.title,
      slug: newArticle.slug,
      excerpt: newArticle.excerpt,
      content: newArticle.content,
      location: newArticle.location,
      cover_image_url: newArticle.cover_image_url,
      cover_image_alt: newArticle.cover_image_alt,
      published: newArticle.published,
      published_at: newArticle.published_at,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create article: ${error.message}`);
  }

  const created = data as Article;

  if (articleData.galleryPhotos && articleData.galleryPhotos.length > 0) {
    const formattedPhotos = articleData.galleryPhotos.map((p) => ({
      image_url: p.image_url,
      storage_path: p.storage_path || null,
      caption: p.caption || null,
      sort_order: p.sort_order,
    }));
    await savePhotos(created.id, formattedPhotos);
  }

  return created;
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  articleData: Partial<Article> & { galleryPhotos?: { image_url: string; storage_path?: string; caption?: string; sort_order: number }[] }
): Promise<Article> {
  const current = await getArticleById(id);
  if (!current) throw new Error('Story not found');

  let slug = current.slug;
  if (articleData.slug && articleData.slug !== current.slug) {
    slug = await ensureUniqueSlug(generateSlug(articleData.slug), id);
  } else if (!slug && articleData.title) {
    slug = await ensureUniqueSlug(generateSlug(articleData.title), id);
  }

  let publishedAt = articleData.published_at !== undefined ? articleData.published_at : current.published_at;
  if (articleData.published && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const excerpt = articleData.excerpt !== undefined 
    ? (articleData.excerpt?.trim() ? articleData.excerpt : extractExcerptFromHtml(articleData.content || current.content || ''))
    : current.excerpt;

  const now = new Date().toISOString();

  const updatedRecord: Article = {
    ...current,
    ...articleData,
    id,
    slug,
    excerpt: excerpt || null,
    published_at: publishedAt,
    updated_at: now,
  };

  if (!isSupabaseConfigured) {
    const all = await getMockArticles();
    const index = all.findIndex((a) => a.id === id);
    if (index !== -1) {
      all[index] = updatedRecord;
      await setMockArticles(all);
    }

    if (articleData.galleryPhotos) {
      const formattedPhotos = articleData.galleryPhotos.map((p) => ({
        image_url: p.image_url,
        storage_path: p.storage_path || null,
        caption: p.caption || null,
        sort_order: p.sort_order,
      }));
      await savePhotos(id, formattedPhotos);
    }

    return updatedRecord;
  }

  const { data, error } = await supabase
    .from('articles')
    .update({
      title: updatedRecord.title,
      slug: updatedRecord.slug,
      excerpt: updatedRecord.excerpt,
      content: updatedRecord.content,
      location: updatedRecord.location,
      cover_image_url: updatedRecord.cover_image_url,
      cover_image_alt: updatedRecord.cover_image_alt,
      published: updatedRecord.published,
      published_at: updatedRecord.published_at,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update story: ${error.message}`);
  }

  if (articleData.galleryPhotos) {
    const formattedPhotos = articleData.galleryPhotos.map((p) => ({
      image_url: p.image_url,
      storage_path: p.storage_path || null,
      caption: p.caption || null,
      sort_order: p.sort_order,
    }));
    await savePhotos(id, formattedPhotos);
  }

  return data as Article;
}

/**
 * Toggle publish status
 */
export async function togglePublishArticle(id: string, published: boolean): Promise<Article> {
  const current = await getArticleById(id);
  if (!current) throw new Error('Story not found');

  const publishedAt = published ? (current.published_at || new Date().toISOString()) : current.published_at;

  return updateArticle(id, {
    published,
    published_at: publishedAt,
  });
}

/**
 * Delete an article and cascade its photos and storage files
 */
export async function deleteArticle(id: string): Promise<void> {
  const article = await getArticleById(id);
  if (!article) return;

  // Cleanup cover image if stored locally or in bucket
  if (article.cover_image_url && article.cover_image_url.includes('photography/articles/')) {
    const storagePath = `articles/${id}/cover.webp`;
    await deleteImage(storagePath);
  }

  // Cleanup all gallery photos
  if (article.photos && article.photos.length > 0) {
    for (const photo of article.photos) {
      if (photo.storage_path) {
        await deleteImage(photo.storage_path);
      }
    }
  }

  if (!isSupabaseConfigured) {
    const all = (await getMockArticles()).filter((a) => a.id !== id);
    await setMockArticles(all);
    const photos = (await getMockPhotos()).filter((p: any) => p.article_id !== id);
    await idbSet('roohi_photos_data', photos);
    return;
  }

  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) {
    throw new Error(`Failed to delete story: ${error.message}`);
  }
}

/**
 * Dashboard stats: Total Stories, Published, Drafts, Photos
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured) {
    const articles = await getMockArticles();
    const photos = await getMockPhotos();

    const publishedStories = articles.filter((a) => a.published).length;
    return {
      totalStories: articles.length,
      publishedStories,
      draftStories: articles.length - publishedStories,
      totalPhotos: photos.length,
    };
  }

  const [articlesRes, photosRes] = await Promise.all([
    supabase.from('articles').select('id, published'),
    supabase.from('photos').select('id', { count: 'exact' }),
  ]);

  const articles = articlesRes.data || [];
  const publishedStories = articles.filter((a) => a.published).length;

  return {
    totalStories: articles.length,
    publishedStories,
    draftStories: articles.length - publishedStories,
    totalPhotos: photosRes.count || 0,
  };
}
