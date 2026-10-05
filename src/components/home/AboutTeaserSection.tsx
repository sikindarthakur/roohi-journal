import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { getSocialIcon, getSocialColor } from '@/components/common/SocialIcons';
import { normalizeSocialLinks } from '@/lib/social';

export const AboutTeaserSection: React.FC = () => {
  const { profile, socialLinks } = useSiteConfig();
  const socialItems = normalizeSocialLinks(socialLinks);
  const primarySocial = socialItems.find((s) => s.platform === 'instagram') || socialItems[0];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-[#11141c]/80 border border-white/5 p-8 sm:p-14 lg:p-20">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-stone-800 group">
              <img
                src={profile.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85'}
                alt={profile.name || 'Roohi'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 block">
              Behind the Lens
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-stone-100 mb-6 leading-tight">
              Hello, I'm {profile.name || 'Roohi'}.
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl">
              {profile.bio || 'Visual storyteller and landscape photographer. Chasing quiet dawn light, wild mountain ridgelines, and cinematic narratives across the world.'}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-stone-100 text-stone-950 hover:bg-amber-400 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {primarySocial && (
                <a
                  href={primarySocial.url.startsWith('http') ? primarySocial.url : `https://${primarySocial.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 text-xs font-medium tracking-wider uppercase transition-colors"
                >
                  {(() => {
                    const Icon = getSocialIcon(primarySocial.platform, primarySocial.url);
                    const colorClass = getSocialColor(primarySocial.platform, primarySocial.url);
                    return <Icon className={`w-4 h-4 ${colorClass}`} />;
                  })()}
                  <span>{primarySocial.title || primarySocial.platform}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
