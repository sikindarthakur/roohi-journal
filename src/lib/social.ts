import { supabase, isSupabaseConfigured } from './supabase';
import { SocialLinks, SocialLinkItem } from '@/types';
import { initialSocialLinks } from './mockData';
import { idbGet, idbSet } from './idb';

const MOCK_SOCIAL_KEY = 'roohi_social_links_data';

/**
 * Normalizes any SocialLinks object into an array of SocialLinkItem objects,
 * supporting both custom_links array and legacy individual columns.
 */
export function normalizeSocialLinks(socialLinks?: SocialLinks | null): SocialLinkItem[] {
  if (!socialLinks) return [];

  // If custom_links is defined as an array, use it
  if (Array.isArray(socialLinks.custom_links)) {
    return socialLinks.custom_links.filter((item) => Boolean(item.url && item.url.trim() !== ''));
  }

  // Fallback / legacy columns conversion
  const items: SocialLinkItem[] = [];

  if (socialLinks.instagram?.trim()) {
    items.push({ id: 'sl-instagram', platform: 'instagram', title: 'Instagram', url: socialLinks.instagram.trim() });
  }
  if (socialLinks.linkedin?.trim()) {
    items.push({ id: 'sl-linkedin', platform: 'linkedin', title: 'LinkedIn', url: socialLinks.linkedin.trim() });
  }
  if (socialLinks.x?.trim() || socialLinks.twitter?.trim()) {
    items.push({ id: 'sl-x', platform: 'x', title: 'X (Twitter)', url: (socialLinks.x || socialLinks.twitter)!.trim() });
  }
  if (socialLinks.snapchat?.trim()) {
    items.push({ id: 'sl-snapchat', platform: 'snapchat', title: 'Snapchat', url: socialLinks.snapchat.trim() });
  }
  if (socialLinks.youtube?.trim()) {
    items.push({ id: 'sl-youtube', platform: 'youtube', title: 'YouTube', url: socialLinks.youtube.trim() });
  }
  if (socialLinks.pinterest?.trim()) {
    items.push({ id: 'sl-pinterest', platform: 'pinterest', title: 'Pinterest', url: socialLinks.pinterest.trim() });
  }
  if (socialLinks.facebook?.trim()) {
    items.push({ id: 'sl-facebook', platform: 'facebook', title: 'Facebook', url: socialLinks.facebook.trim() });
  }

  return items;
}

export async function getSocialLinks(): Promise<SocialLinks> {
  if (!isSupabaseConfigured) {
    const saved = await idbGet<SocialLinks>(MOCK_SOCIAL_KEY);
    return saved || initialSocialLinks;
  }

  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.warn('Error fetching social links from Supabase, using defaults:', error?.message);
    const saved = await idbGet<SocialLinks>(MOCK_SOCIAL_KEY);
    return saved || initialSocialLinks;
  }

  return data as SocialLinks;
}

export async function updateSocialLinks(linksData: Partial<SocialLinks>): Promise<SocialLinks> {
  const current = await getSocialLinks();
  const updated: SocialLinks = {
    ...current,
    ...linksData,
    updated_at: new Date().toISOString(),
  };

  // Always sync to local IndexedDB for immediate offline availability
  await idbSet(MOCK_SOCIAL_KEY, updated);

  if (!isSupabaseConfigured) {
    return updated;
  }

  try {
    // Attempt full update with custom_links JSON and standard columns
    const payload: Record<string, any> = {
      instagram: updated.instagram || null,
      youtube: updated.youtube || null,
      pinterest: updated.pinterest || null,
      facebook: updated.facebook || null,
      linkedin: updated.linkedin || null,
      x: updated.x || null,
      snapchat: updated.snapchat || null,
      custom_links: updated.custom_links || [],
      updated_at: updated.updated_at,
    };

    const { data, error } = await supabase
      .from('social_links')
      .update(payload)
      .eq('id', current.id)
      .select()
      .single();

    if (!error && data) {
      return data as SocialLinks;
    }

    if (error) {
      // If extended columns don't exist yet in Supabase table, update legacy columns
      console.warn('Falling back to basic columns for Supabase update:', error.message);
      const fallbackPayload = {
        instagram: updated.instagram || null,
        youtube: updated.youtube || null,
        pinterest: updated.pinterest || null,
        facebook: updated.facebook || null,
      };

      const { data: fbData } = await supabase
        .from('social_links')
        .update(fallbackPayload)
        .eq('id', current.id)
        .select()
        .single();

      return {
        ...(fbData || current),
        ...updated,
      } as SocialLinks;
    }
  } catch (err) {
    console.warn('Supabase update encountered an issue, saved locally in IndexedDB:', err);
  }

  return updated;
}
