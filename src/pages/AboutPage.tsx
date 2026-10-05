import React from 'react';
import { SEO } from '@/components/common/SEO';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { Camera, MapPin, Award } from 'lucide-react';
import { getSocialIcon, getSocialColor } from '@/components/common/SocialIcons';
import { normalizeSocialLinks } from '@/lib/social';

export const AboutPage: React.FC = () => {
  const { profile, socialLinks, isLoading } = useSiteConfig();

  const socialItems = normalizeSocialLinks(socialLinks);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0d11] pt-32 pb-24 px-6 sm:px-8">
      <SEO
        title={`About ${profile.name || 'Roohi'} • Biography & Vision`}
        description={profile.bio || 'Photographer, writer, and visual storyteller.'}
        image={profile.profile_image_url}
      />

      <div className="max-w-5xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl aspect-[4/5] sticky top-28">
              <img
                src={profile.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85'}
                alt={profile.name || 'Roohi'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

              {/* Tag on bottom */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between text-xs text-stone-200">
                <span className="font-serif italic text-amber-300 font-medium">{profile.name || 'Roohi'}</span>
                <span className="text-[11px] tracking-widest uppercase text-stone-400">
                  {profile.badge_title || 'Visual Diarist'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio and Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500 mb-3 block">
                The Storyteller
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-stone-100 leading-tight">
                {profile.name || 'Roohi'}
              </h1>
              <p className="font-serif italic text-xl text-stone-300 mt-2">
                {profile.tagline || 'Photographer • Traveller • Storyteller'}
              </p>
            </div>

            {/* Bio Body */}
            <div className="prose-editorial text-stone-300 space-y-6 text-base sm:text-lg leading-relaxed font-light">
              {profile.bio && (
                <p>
                  {profile.bio}
                </p>
              )}
              {profile.philosophy && (
                <p>
                  {profile.philosophy}
                </p>
              )}
              {profile.quote && (
                <blockquote className="font-serif text-xl sm:text-2xl text-stone-100 italic border-l-2 border-amber-500 pl-6 my-6">
                  "{profile.quote}"
                </blockquote>
              )}
              {profile.technical_summary && (
                <p>
                  {profile.technical_summary}
                </p>
              )}
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
              <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800/60">
                <Camera className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-1">
                  {profile.highlight_1_title || 'Medium'}
                </h4>
                <p className="text-xs text-stone-400">
                  {profile.highlight_1_desc || 'Natural light & environmental portraiture'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800/60">
                <MapPin className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-1">
                  {profile.highlight_2_title || 'Passage'}
                </h4>
                <p className="text-xs text-stone-400">
                  {profile.highlight_2_desc || 'Heritage trails, misty tea gardens & sacred river ghats'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800/60">
                <Award className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-1">
                  {profile.highlight_3_title || 'Ethos'}
                </h4>
                <p className="text-xs text-stone-400">
                  {profile.highlight_3_desc || 'Quiet presence, leave no trace'}
                </p>
              </div>
            </div>

            {/* Social Channels */}
            {socialItems.length > 0 && (
              <div className="pt-8 border-t border-stone-800">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-400 mb-4">
                  Connect & Follow Along
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialItems.map((item) => {
                    const Icon = getSocialIcon(item.platform, item.url);
                    const colorClass = getSocialColor(item.platform, item.url);
                    return (
                      <a
                        key={item.id || item.url}
                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-850 text-stone-200 hover:text-white border border-stone-800 hover:border-amber-500/40 text-xs font-medium tracking-wider uppercase transition-all shadow-md group"
                      >
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${colorClass}`} />
                        <span>{item.title || item.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
