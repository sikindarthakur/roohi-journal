import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Roohi • Photography & Travel Journal",
  description = "A visual diary and publishing platform where photography, travel, and storytelling come together in cinematic editorial essays.",
  image,
  url,
  type = "website",
}) => {
  useEffect(() => {
    // Update document title
    document.title = title.includes("Roohi") ? title : `${title} | Roohi`;

    // Update meta tags dynamically
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
      updateMeta('twitter:description', description);
    }

    updateMeta('og:title', title, true);
    updateMeta('twitter:title', title);
    updateMeta('og:type', type, true);

    if (url) {
      updateMeta('og:url', url, true);
    }

    if (image) {
      updateMeta('og:image', image, true);
      updateMeta('twitter:image', image);
      updateMeta('twitter:card', 'summary_large_image');
    }
  }, [title, description, image, url, type]);

  return null;
};
