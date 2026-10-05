import { supabase, isSupabaseConfigured } from './supabase';
import { Photo } from '@/types';
import { initialPhotos } from './mockData';
import { deleteImage } from './storage';
import { idbGet, idbSet } from './idb';
import { getMockArticles } from './articles';

const MOCK_PHOTOS_KEY = 'roohi_photos_data';

export async function getMockPhotos(): Promise<Photo[]> {
  const saved = await idbGet<Photo[]>(MOCK_PHOTOS_KEY);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    return saved;
  }
  await idbSet(MOCK_PHOTOS_KEY, initialPhotos);
  return initialPhotos;
}

export async function setMockPhotos(photos: Photo[]): Promise<void> {
  await idbSet(MOCK_PHOTOS_KEY, photos);
}

export async function getPhotosByArticleId(articleId: string): Promise<Photo[]> {
  if (!isSupabaseConfigured) {
    const all = await getMockPhotos();
    return all
      .filter((p) => p.article_id === articleId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('article_id', articleId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching photos for article:', error);
    return [];
  }

  return data as Photo[];
}

export async function getAllPublishedPhotos(): Promise<(Photo & { article_title?: string; article_slug?: string })[]> {
  if (!isSupabaseConfigured) {
    const photos = await getMockPhotos();
    const articles = await getMockArticles();
    const publishedArticleMap = new Map<string, { title: string; slug: string }>();

    articles.forEach((a: any) => {
      if (a.published) {
        publishedArticleMap.set(a.id, { title: a.title, slug: a.slug });
      }
    });

    const result: (Photo & { article_title?: string; article_slug?: string })[] = [];
    photos.forEach((p) => {
      const art = publishedArticleMap.get(p.article_id);
      if (art) {
        result.push({
          ...p,
          article_title: art.title,
          article_slug: art.slug,
        });
      }
    });

    return result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }

  const { data, error } = await supabase
    .from('photos')
    .select(`
      id,
      article_id,
      image_url,
      storage_path,
      caption,
      sort_order,
      created_at,
      articles!inner (
        id,
        title,
        slug,
        published,
        published_at
      )
    `)
    .eq('articles.published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all published photos:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    article_id: row.article_id,
    image_url: row.image_url,
    storage_path: row.storage_path,
    caption: row.caption,
    sort_order: row.sort_order,
    created_at: row.created_at,
    article_title: row.articles?.title,
    article_slug: row.articles?.slug,
  }));
}

export async function savePhotos(articleId: string, photos: Omit<Photo, 'id' | 'article_id'>[]): Promise<Photo[]> {
  if (!isSupabaseConfigured) {
    const all = (await getMockPhotos()).filter((p) => p.article_id !== articleId);
    const newPhotos: Photo[] = photos.map((p, index) => ({
      ...p,
      id: `p-${articleId}-${Date.now()}-${index}`,
      article_id: articleId,
      created_at: new Date().toISOString(),
    }));
    const updated = [...all, ...newPhotos];
    await setMockPhotos(updated);
    return newPhotos;
  }

  // Delete existing photos for this article
  await supabase.from('photos').delete().eq('article_id', articleId);

  if (photos.length === 0) return [];

  const rows = photos.map((p, index) => ({
    article_id: articleId,
    image_url: p.image_url,
    storage_path: p.storage_path || null,
    caption: p.caption || null,
    sort_order: p.sort_order ?? index + 1,
  }));

  const { data, error } = await supabase
    .from('photos')
    .insert(rows)
    .select();

  if (error) {
    throw new Error(`Failed to save gallery photos: ${error.message}`);
  }

  return data as Photo[];
}

export async function deleteSinglePhoto(photoId: string, storagePath?: string | null): Promise<void> {
  if (storagePath) {
    await deleteImage(storagePath);
  }

  if (!isSupabaseConfigured) {
    const all = (await getMockPhotos()).filter((p) => p.id !== photoId);
    await setMockPhotos(all);
    return;
  }

  await supabase.from('photos').delete().eq('id', photoId);
}
