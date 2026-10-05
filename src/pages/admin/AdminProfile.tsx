import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/common/SEO';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { updateProfile } from '@/lib/profile';
import {
  Save,
  User,
  Quote,
  Sparkles,
  Award,
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { profile, refreshConfig } = useSiteConfig();

  // Core Identity
  const [name, setName] = useState(profile.name || 'Roohi');
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [badgeTitle, setBadgeTitle] = useState(profile.badge_title || '');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(profile.profile_image_url || null);

  // Editorial Storytelling
  const [bio, setBio] = useState(profile.bio || '');
  const [philosophy, setPhilosophy] = useState(profile.philosophy || '');
  const [quote, setQuote] = useState(profile.quote || '');
  const [technicalSummary, setTechnicalSummary] = useState(profile.technical_summary || '');

  // Highlight Cards
  const [highlight1Title, setHighlight1Title] = useState(profile.highlight_1_title || '');
  const [highlight1Desc, setHighlight1Desc] = useState(profile.highlight_1_desc || '');
  const [highlight2Title, setHighlight2Title] = useState(profile.highlight_2_title || '');
  const [highlight2Desc, setHighlight2Desc] = useState(profile.highlight_2_desc || '');
  const [highlight3Title, setHighlight3Title] = useState(profile.highlight_3_title || '');
  const [highlight3Desc, setHighlight3Desc] = useState(profile.highlight_3_desc || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name || 'Roohi');
    setTagline(profile.tagline || 'Photographer • Traveller • Storyteller');
    setBadgeTitle(profile.badge_title || 'Visual Diarist');
    setProfileImageUrl(profile.profile_image_url || null);
    setBio(profile.bio || '');
    setPhilosophy(profile.philosophy || '');
    setQuote(profile.quote || '');
    setTechnicalSummary(profile.technical_summary || '');
    setHighlight1Title(profile.highlight_1_title || 'Medium');
    setHighlight1Desc(profile.highlight_1_desc || 'Natural light & environmental portraiture');
    setHighlight2Title(profile.highlight_2_title || 'Passage');
    setHighlight2Desc(profile.highlight_2_desc || 'Heritage trails, misty tea gardens & sacred river ghats');
    setHighlight3Title(profile.highlight_3_title || 'Ethos');
    setHighlight3Desc(profile.highlight_3_desc || 'Quiet presence, leave no trace');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim() || 'Roohi',
        tagline: tagline.trim(),
        badge_title: badgeTitle.trim(),
        profile_image_url: profileImageUrl,
        bio: bio.trim(),
        philosophy: philosophy.trim(),
        quote: quote.trim(),
        technical_summary: technicalSummary.trim(),
        highlight_1_title: highlight1Title.trim(),
        highlight_1_desc: highlight1Desc.trim(),
        highlight_2_title: highlight2Title.trim(),
        highlight_2_desc: highlight2Desc.trim(),
        highlight_3_title: highlight3Title.trim(),
        highlight_3_desc: highlight3Desc.trim(),
      });

      await refreshConfig();
      setSuccessMsg('Profile & About page updated successfully! All changes are live across the site.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Profile & About Page Management • Studio Control" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500 mb-1 block">
            Public Identity & Biography
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
            Author Profile & About Page
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Customize everything visitors see on your About page, portrait badge, editorial philosophy, and website footer.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white hover:border-amber-500/50 text-xs font-medium tracking-wider uppercase transition-all self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span>View Live About Page</span>
        </a>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-400 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-emerald-400 text-xs">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* SECTION 1: Core Brand & Portrait */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800/80">
            <User className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                1. Brand Identity & Portrait
              </h2>
              <p className="text-xs text-stone-400">Your public name, header tagline, and profile picture</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Author Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Roohi"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[11px] text-stone-500 mt-1">Appears across the top navbar, header, and copyright.</p>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Subtitle Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Photographer • Traveller • Storyteller"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[11px] text-stone-500 mt-1">Displayed below your name on the About page and Footer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800/60">
            {/* Portrait Badge */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Portrait Badge Label
              </label>
              <input
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                placeholder="Visual Diarist"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p className="text-[11px] text-stone-500 mt-1">Small badge overlay at the bottom of your portrait card.</p>
            </div>

            {/* Profile Photo Upload */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Author Portrait Photo
              </h3>
              <ImageUploader
                value={profileImageUrl}
                onChange={(url) => setProfileImageUrl(url)}
                storagePathPrefix="profile"
                label="Portrait Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Editorial Biography & Narrative */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800/80">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                2. Editorial Narrative & Story
              </h2>
              <p className="text-xs text-stone-400">Tell readers your story, philosophy, quote, and creative method</p>
            </div>
          </div>

          {/* Bio (Paragraph 1) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Introduction Bio <span className="text-stone-500 font-normal">(Paragraph 1)</span>
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Photographer, writer, and visual diarist. Exploring the timeless soul of India..."
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm leading-relaxed placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p className="text-[11px] text-stone-500 mt-1">Featured on both the Homepage About teaser and the About page.</p>
          </div>

          {/* Philosophy (Paragraph 2) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Travel Philosophy & Artistic Vision <span className="text-stone-500 font-normal">(Paragraph 2)</span>
            </label>
            <textarea
              rows={3}
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
              placeholder="My philosophy centers on slow travel — lingering long after the tour buses depart..."
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm leading-relaxed placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Featured Quote */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              Featured Editorial Quote
            </label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Photography is the practice of noticing the quiet poetry that the world whispers when no one is shouting."
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm font-serif italic placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p className="text-[11px] text-stone-500 mt-1">Rendered with elegant gold border styling in the center of the story.</p>
          </div>

          {/* Technical Craft (Paragraph 3) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Craft, Lenses & Methodology <span className="text-stone-500 font-normal">(Paragraph 3)</span>
            </label>
            <textarea
              rows={3}
              value={technicalSummary}
              onChange={(e) => setTechnicalSummary(e.target.value)}
              placeholder="Every story in this journal is paired with high-fidelity imagery captured on prime lenses..."
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm leading-relaxed placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* SECTION 3: Highlights & Focus Areas */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800/80">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                3. Three Pillars / Highlight Cards
              </h2>
              <p className="text-xs text-stone-400">The 3 feature boxes displayed at the bottom of your About page</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Camera className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Card #1</span>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={highlight1Title}
                  onChange={(e) => setHighlight1Title(e.target.value)}
                  placeholder="Medium"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={highlight1Desc}
                  onChange={(e) => setHighlight1Desc(e.target.value)}
                  placeholder="Natural light & environmental portraiture"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Card #2</span>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={highlight2Title}
                  onChange={(e) => setHighlight2Title(e.target.value)}
                  placeholder="Passage"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={highlight2Desc}
                  onChange={(e) => setHighlight2Desc(e.target.value)}
                  placeholder="Heritage trails, tea gardens & ghats"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Card #3</span>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  value={highlight3Title}
                  onChange={(e) => setHighlight3Title(e.target.value)}
                  placeholder="Ethos"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={highlight3Desc}
                  onChange={(e) => setHighlight3Desc(e.target.value)}
                  placeholder="Quiet presence, leave no trace"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview live changes on /about</span>
          </a>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
