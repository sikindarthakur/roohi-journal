import React from 'react';
import DOMPurify from 'dompurify';

interface StoryBodyProps {
  content: string | null;
}

export const StoryBody: React.FC<StoryBodyProps> = ({ content }) => {
  if (!content || content.trim() === '') {
    return null;
  }

  // Sanitize rich-text HTML against XSS
  const sanitizedContent = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'loading'],
  });

  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      {/* Editorial Rich-Text Typography Container */}
      <div
        className="prose-editorial font-light selection:bg-amber-500/20"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
};
