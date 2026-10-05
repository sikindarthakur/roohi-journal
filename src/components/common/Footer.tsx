import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { normalizeSocialLinks } from '@/lib/social';
import { getSocialIcon, getSocialColor } from './SocialIcons';

export const Footer: React.FC = () => {
  const { profile, socialLinks } = useSiteConfig();
  const currentYear = new Date().getFullYear();

  const socialItems = normalizeSocialLinks(socialLinks);

  return (
    <footer className="bg-[#090b0e] border-t border-stone-800/80 text-stone-400 py-16 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Brand Name */}
        <Link
          to="/"
          className="font-cinzel text-3xl sm:text-4xl tracking-[0.3em] font-medium uppercase text-stone-100 hover:text-amber-300 transition-colors mb-3"
        >
          {profile.name ? profile.name.toUpperCase() : 'ROOHI'}
        </Link>

        {/* Subtitle */}
        <p className="font-serif italic text-lg sm:text-xl text-stone-300 tracking-wide mb-8">
          {profile.tagline || 'Photographer • Traveller • Storyteller'}
        </p>

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs tracking-[0.2em] uppercase font-medium text-stone-400 mb-10">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <Link to="/stories" className="hover:text-amber-400 transition-colors">Stories</Link>
          <Link to="/gallery" className="hover:text-amber-400 transition-colors">Gallery</Link>
          <Link to="/about" className="hover:text-amber-400 transition-colors">About</Link>
        </div>

        {/* Social Links (Dynamic from config) */}
        {socialItems.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            {socialItems.map((item) => {
              const Icon = getSocialIcon(item.platform, item.url);
              const colorClass = getSocialColor(item.platform, item.url);
              return (
                <a
                  key={item.id || item.url}
                  href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.title || item.platform}`}
                  title={item.title || item.platform}
                  className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/40 hover:bg-stone-800/80 transition-all duration-300 shadow-lg group"
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-115 ${colorClass}`} />
                </a>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="w-24 h-[1px] bg-stone-800 mb-8" />

        {/* Bottom row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {currentYear} Roohi. All photographs and writings protected by copyright.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-stone-500 hover:text-stone-300 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
