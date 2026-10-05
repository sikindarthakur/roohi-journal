import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, SocialLinks } from '@/types';
import { getProfile } from '@/lib/profile';
import { getSocialLinks } from '@/lib/social';
import { initialProfile, initialSocialLinks } from '@/lib/mockData';

interface SiteConfigContextType {
  profile: Profile;
  socialLinks: SocialLinks;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  profile: initialProfile,
  socialLinks: initialSocialLinks,
  isLoading: true,
  refreshConfig: async () => {},
});

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialSocialLinks);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([getProfile(), getSocialLinks()]);
      setProfile(p);
      setSocialLinks(s);
    } catch (err) {
      console.error('Error loading site config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  return (
    <SiteConfigContext.Provider value={{ profile, socialLinks, isLoading, refreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export function useSiteConfig(): SiteConfigContextType {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
