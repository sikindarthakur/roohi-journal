import React from 'react';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
  </svg>
);

export const PinterestIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.86 18.5V10.13H5.07V18.5h2.79z" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const SnapchatIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.003 2c-3.662 0-6.147 2.656-6.147 5.764 0 .979.255 2.115.54 2.766.082.187.054.341-.077.465-.246.233-.787.529-1.24.783-.341.192-.596.48-.485.892.127.472.637.708 1.139.756.402.038.831-.059 1.144.135.25.155.337.477.301.761-.064.502-.387 1.096-.641 1.549-.336.598-.679 1.189-.283 1.77.387.568 1.488.75 2.457.737.608-.008 1.192-.123 1.782-.246.368-.077.74-.083 1.066.126.549.351 1.082.351 1.631 0 .326-.209.698-.203 1.066-.126.59.123 1.174.238 1.782.246.969.013 2.07-.169 2.457-.737.396-.581.053-1.172-.283-1.77-.254-.453-.577-1.047-.641-1.549-.036-.284.051-.606.301-.761.313-.194.742-.097 1.144-.135.502-.048 1.012-.284 1.139-.756.111-.412-.144-.7-.485-.892-.453-.254-.994-.55-1.24-.783-.131-.124-.159-.278-.077-.465.285-.651.54-1.787.54-2.766C18.15 4.656 15.665 2 12.003 2z" />
  </svg>
);

export const ThreadsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24C5.467 24 0 18.675 0 12.122 0 5.57 5.467.245 12.186.245c6.602 0 11.968 5.143 12.046 11.603h-2.82c-.073-4.912-4.14-8.825-9.226-8.825-5.187 0-9.406 4.14-9.406 9.1 0 4.958 4.219 9.1 9.406 9.1 4.296 0 7.49-2.709 8.277-6.721H12.186v-2.778h11.758C23.953 20.316 18.665 24 12.186 24z" />
  </svg>
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export interface SocialPlatformInfo {
  key: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  defaultPlaceholder: string;
  brandColorClass: string;
}

export const SUPPORTED_PLATFORMS: SocialPlatformInfo[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    icon: InstagramIcon,
    defaultPlaceholder: 'https://instagram.com/username',
    brandColorClass: 'text-amber-500',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: LinkedinIcon,
    defaultPlaceholder: 'https://linkedin.com/in/username',
    brandColorClass: 'text-sky-400',
  },
  {
    key: 'x',
    name: 'X (Twitter)',
    icon: XIcon,
    defaultPlaceholder: 'https://x.com/username',
    brandColorClass: 'text-stone-200',
  },
  {
    key: 'snapchat',
    name: 'Snapchat',
    icon: SnapchatIcon,
    defaultPlaceholder: 'https://snapchat.com/add/username',
    brandColorClass: 'text-yellow-400',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: YoutubeIcon,
    defaultPlaceholder: 'https://youtube.com/@username',
    brandColorClass: 'text-red-500',
  },
  {
    key: 'pinterest',
    name: 'Pinterest',
    icon: PinterestIcon,
    defaultPlaceholder: 'https://pinterest.com/username',
    brandColorClass: 'text-rose-500',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    icon: FacebookIcon,
    defaultPlaceholder: 'https://facebook.com/username',
    brandColorClass: 'text-blue-500',
  },
  {
    key: 'threads',
    name: 'Threads',
    icon: ThreadsIcon,
    defaultPlaceholder: 'https://threads.net/@username',
    brandColorClass: 'text-stone-300',
  },
  {
    key: 'website',
    name: 'Personal Website / Link',
    icon: GlobeIcon,
    defaultPlaceholder: 'https://mywebsite.com',
    brandColorClass: 'text-emerald-400',
  },
];

/**
 * Auto-detect the social platform key from a given URL
 */
export function detectSocialPlatform(url: string): string {
  if (!url) return 'website';
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('x.com') || lower.includes('twitter.com')) return 'x';
  if (lower.includes('snapchat.com')) return 'snapchat';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('pinterest.com')) return 'pinterest';
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
  if (lower.includes('threads.net')) return 'threads';
  return 'website';
}

/**
 * Helper to get the React Icon component for a given platform name/key or URL
 */
export function getSocialIcon(platformOrKey?: string, url?: string): React.FC<{ className?: string }> {
  const key = platformOrKey?.toLowerCase() || (url ? detectSocialPlatform(url) : 'website');

  switch (key) {
    case 'instagram':
      return InstagramIcon;
    case 'linkedin':
      return LinkedinIcon;
    case 'x':
    case 'twitter':
      return XIcon;
    case 'snapchat':
      return SnapchatIcon;
    case 'youtube':
      return YoutubeIcon;
    case 'pinterest':
      return PinterestIcon;
    case 'facebook':
      return FacebookIcon;
    case 'threads':
      return ThreadsIcon;
    default:
      return GlobeIcon;
  }
}

/**
 * Helper to get the brand color class for a given platform
 */
export function getSocialColor(platformOrKey?: string, url?: string): string {
  const key = platformOrKey?.toLowerCase() || (url ? detectSocialPlatform(url) : 'website');
  const found = SUPPORTED_PLATFORMS.find((p) => p.key === key);
  return found?.brandColorClass || 'text-amber-400';
}
