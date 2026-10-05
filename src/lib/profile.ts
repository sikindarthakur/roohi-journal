import { supabase, isSupabaseConfigured } from './supabase';
import { Profile } from '@/types';
import { initialProfile } from './mockData';
import { idbGet, idbSet } from './idb';

const MOCK_PROFILE_KEY = 'roohi_profile_data';

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured) {
    const saved = await idbGet<Profile>(MOCK_PROFILE_KEY);
    return saved || initialProfile;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.warn('Error fetching profile from Supabase, using defaults:', error?.message);
    return initialProfile;
  }

  return data as Profile;
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const updated: Profile = {
    ...current,
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    await idbSet(MOCK_PROFILE_KEY, updated);
    return updated;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updated.name,
      tagline: updated.tagline || null,
      badge_title: updated.badge_title || null,
      bio: updated.bio,
      philosophy: updated.philosophy || null,
      quote: updated.quote || null,
      technical_summary: updated.technical_summary || null,
      highlight_1_title: updated.highlight_1_title || null,
      highlight_1_desc: updated.highlight_1_desc || null,
      highlight_2_title: updated.highlight_2_title || null,
      highlight_2_desc: updated.highlight_2_desc || null,
      highlight_3_title: updated.highlight_3_title || null,
      highlight_3_desc: updated.highlight_3_desc || null,
      profile_image_url: updated.profile_image_url,
    })
    .eq('id', current.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data as Profile;
}
