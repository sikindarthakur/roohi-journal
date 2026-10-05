import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/common/SEO';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { updateSocialLinks, normalizeSocialLinks } from '@/lib/social';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Share2,
} from 'lucide-react';
import {
  SUPPORTED_PLATFORMS,
  getSocialIcon,
  getSocialColor,
  detectSocialPlatform,
} from '@/components/common/SocialIcons';
import { SocialLinkItem } from '@/types';

export const AdminSettings: React.FC = () => {
  const { socialLinks, refreshConfig } = useSiteConfig();

  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (socialLinks) {
      const normalized = normalizeSocialLinks(socialLinks);
      setLinks(normalized);
    }
  }, [socialLinks]);

  // Prevent accidental navigation if there are unsaved edits
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Add a new platform link
  const handleAddPlatform = (platformKey: string) => {
    const platformInfo = SUPPORTED_PLATFORMS.find((p) => p.key === platformKey);
    const newId = `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newItem: SocialLinkItem = {
      id: newId,
      platform: platformKey,
      title: platformInfo ? platformInfo.name : 'Website',
      url: '',
    };

    setLinks((prev) => [...prev, newItem]);
    setHasUnsavedChanges(true);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // Update a single link's field
  const handleUpdateLink = (id: string, field: keyof SocialLinkItem, value: string) => {
    setLinks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // If URL changes and user hasn't explicitly customized title/platform, auto-detect platform
        if (field === 'url' && value.trim()) {
          const detected = detectSocialPlatform(value);
          if (detected && detected !== 'website' && item.platform === 'website') {
            const platInfo = SUPPORTED_PLATFORMS.find((p) => p.key === detected);
            updated.platform = detected;
            if (item.title === 'Website' || !item.title) {
              updated.title = platInfo ? platInfo.name : detected;
            }
          }
        }

        // If platform changes, auto-update title if it matches standard name
        if (field === 'platform') {
          const platInfo = SUPPORTED_PLATFORMS.find((p) => p.key === value);
          if (platInfo) {
            updated.title = platInfo.name;
          }
        }

        return updated;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Remove link
  const handleRemoveLink = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
  };

  // Move link up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  // Move link down
  const handleMoveDown = (index: number) => {
    if (index === links.length - 1) return;
    setLinks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate URLs
    for (const link of links) {
      if (link.url.trim()) {
        if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
          setErrorMsg(`Please make sure "${link.title || link.platform}" has a valid URL starting with https:// or http://`);
          return;
        }
      }
    }

    setIsSaving(true);

    try {
      // Find standard platforms to populate legacy fields for backwards-compatibility
      const findUrl = (plat: string) => {
        const found = links.find((l) => l.platform.toLowerCase() === plat && l.url.trim());
        return found ? found.url.trim() : null;
      };

      await updateSocialLinks({
        instagram: findUrl('instagram'),
        youtube: findUrl('youtube'),
        pinterest: findUrl('pinterest'),
        facebook: findUrl('facebook'),
        linkedin: findUrl('linkedin'),
        x: findUrl('x'),
        snapchat: findUrl('snapchat'),
        custom_links: links,
      });

      await refreshConfig();
      setHasUnsavedChanges(false);
      setSuccessMsg('Social links and channels updated successfully! All navigation, about pages, and footer references are live.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update social links.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Social Links & Channels • Studio Control" />

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-stone-800">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500 mb-1 block">
          Network Presence
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
              Social Links & Channels
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Add, edit, reorder, or customize any social media channel (LinkedIn, X / Twitter, Snapchat, Instagram, YouTube, etc.). Any blank link is automatically hidden.
            </p>
          </div>

          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium self-start sm:self-center animate-pulse">
              ● Unsaved Changes
            </span>
          )}
        </div>
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

      {/* Quick Add Platform Buttons */}
      <div className="mb-8 bg-[#11141c] border border-stone-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
            Quick Add Platform
          </h2>
        </div>
        <p className="text-xs text-stone-400 mb-4">
          Click any platform below to instantly add a channel to your profile:
        </p>

        <div className="flex flex-wrap gap-2.5">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isAlreadyAdded = links.some((l) => l.platform.toLowerCase() === platform.key.toLowerCase());

            return (
              <button
                key={platform.key}
                type="button"
                onClick={() => handleAddPlatform(platform.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  isAlreadyAdded
                    ? 'bg-stone-900/60 text-stone-300 border-stone-800 hover:border-amber-500/40 hover:text-white'
                    : 'bg-stone-900 hover:bg-stone-850 text-stone-200 border-stone-800 hover:border-amber-500/60 hover:text-amber-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${platform.brandColorClass}`} />
                <span>+ {platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Active Social Links List */}
        <div className="bg-[#11141c] border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
                Active Channels ({links.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleAddPlatform('website')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Link</span>
            </button>
          </div>

          {links.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-stone-800/80 rounded-xl bg-stone-950/40">
              <Share2 className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-300">No social channels configured yet</p>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Click any of the Quick Add buttons above or add a custom link.
              </p>
              <button
                type="button"
                onClick={() => handleAddPlatform('instagram')}
                className="px-4 py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-amber-400 transition-colors"
              >
                + Add Instagram
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((item, index) => {
                const Icon = getSocialIcon(item.platform, item.url);
                const colorClass = getSocialColor(item.platform, item.url);
                const platformInfo = SUPPORTED_PLATFORMS.find((p) => p.key === item.platform);
                const placeholder = platformInfo?.defaultPlaceholder || 'https://...';

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-stone-950/80 border border-stone-800/90 rounded-2xl hover:border-stone-700 transition-all space-y-4 shadow-md group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Platform Picker & Icon */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className={`p-2 rounded-xl bg-stone-900 border border-stone-800 ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Platform Select */}
                        <div className="flex-1 sm:w-48">
                          <select
                            value={item.platform}
                            onChange={(e) => handleUpdateLink(item.id, 'platform', e.target.value)}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            {SUPPORTED_PLATFORMS.map((p) => (
                              <option key={p.key} value={p.key} className="bg-stone-950 text-stone-200">
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Controls: Move Up, Move Down, Remove */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1.5 text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-30 rounded-lg transition-colors border border-stone-800/80"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === links.length - 1}
                          title="Move Down"
                          className="p-1.5 text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-30 rounded-lg transition-colors border border-stone-800/80"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(item.id)}
                          title="Remove Channel"
                          className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs: Title / Label & URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                      {/* Display Label */}
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                          Display Label
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                          placeholder="e.g. LinkedIn, X Profile"
                          className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>

                      {/* Destination URL */}
                      <div className="sm:col-span-8">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1 flex items-center justify-between">
                          <span>Channel / Profile URL</span>
                          {item.url && (
                            <a
                              href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-normal lowercase tracking-normal"
                            >
                              <span>test link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </label>
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-stone-800 rounded-xl text-stone-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Public Site Preview */}
        {links.filter((l) => l.url.trim()).length > 0 && (
          <div className="bg-[#11141c]/90 border border-stone-800/80 rounded-2xl p-6">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3 flex items-center gap-2">
              <span>Live Preview (How it looks on public site)</span>
            </h3>
            <div className="p-4 rounded-xl bg-[#090b0e] border border-stone-800 flex flex-wrap items-center justify-center gap-4">
              {links
                .filter((l) => l.url.trim())
                .map((link) => {
                  const Icon = getSocialIcon(link.platform, link.url);
                  return (
                    <div
                      key={link.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium tracking-wider shadow-sm"
                    >
                      <Icon className={`w-3.5 h-3.5 ${getSocialColor(link.platform, link.url)}`} />
                      <span>{link.title || link.platform}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Save Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-amber-500/15 hover:shadow-amber-500/30 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Channels...' : 'Save Social Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
