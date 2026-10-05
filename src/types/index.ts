export interface Profile {
  id: string;
  name: string;
  tagline?: string | null;
  badge_title?: string | null;
  bio: string;
  philosophy?: string | null;
  quote?: string | null;
  technical_summary?: string | null;
  highlight_1_title?: string | null;
  highlight_1_desc?: string | null;
  highlight_2_title?: string | null;
  highlight_2_desc?: string | null;
  highlight_3_title?: string | null;
  highlight_3_desc?: string | null;
  profile_image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  title: string;
  url: string;
}

export interface SocialLinks {
  id: string;
  instagram?: string | null;
  youtube?: string | null;
  pinterest?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  x?: string | null;
  twitter?: string | null;
  snapchat?: string | null;
  custom_links?: SocialLinkItem[];
  updated_at?: string;
}

export interface Photo {
  id: string;
  article_id: string;
  image_url: string;
  storage_path: string | null;
  caption: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  location: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  photos?: Photo[];
}

export interface ArticleWithPhotos extends Article {
  photos: Photo[];
}

export interface DashboardStats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  totalPhotos: number;
}

export interface StorageUploadResult {
  url: string;
  path: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export interface LightboxItem {
  id: string;
  url: string;
  caption?: string | null;
  storyTitle?: string;
  storySlug?: string;
}
