# Roohi • Photography & Travel Journal

> A cinematic, photography-first publishing platform and visual diary designed for Roohi. Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## 🌟 Key Features

### 📸 Public Experience
- **Cinematic Hero Carousel (FR-HERO)**:
  - Displays the latest 5 published stories (`published_at DESC`, `LIMIT 5`) with no month filtering.
  - Automatically updates when stories are published or unpublished.
  - Features high-resolution cover photography with dark gradient overlays for guaranteed text contrast.
  - Interactive previous/next arrows, slide progress dots, and a **pause/play autoplay control**.
  - Touch swipe gestures on mobile and full keyboard navigation support.
  - Priority eager loading on slide #1 (`loading="eager"`) and lazy loading on subsequent slides.
- **Latest Stories Section (FR-HOME)**: Responsive card grid highlighting the most recent essays with location tags and publication dates.
- **Curated Photography Preview (FR-HOME & FR-GAL)**: Dynamic photo grid with full-screen Lightbox integration.
- **The Visual Wall / Gallery (`/gallery`)**: Masonry photo wall aggregating photographs across all published stories with story backlinks.
- **Editorial Story Pages (`/stories/:slug`)**:
  - Full-width cinematic cover header with location, date, and calculated reading time.
  - Editorial typography (`prose-editorial`) sanitized via **DOMPurify** supporting headings, blockquotes, lists, and inline imagery.
  - Story photo gallery with order preservation.
  - **Full-Screen Lightbox**: Previous/next navigation, counter (`3 / 18`), touch swipe, keyboard controls (`ArrowLeft`, `ArrowRight`, `Esc`), focus trap, and ARIA dialog semantics.
- **About Page (`/about`)**: Personal biography, author portrait, and dynamic social media presence.
- **Synchronized Social Links**: All public components (Navbar, Footer, About Teaser, About Page) read from a single database source. Empty or unconfigured social networks are automatically hidden.

---

## 🛡️ Admin Studio (`/admin`)
- **Owner Authentication (`/admin/login`)**: Email and password session management via Supabase Auth.
- **Studio Dashboard (`/admin`)**:
  - Real-time statistics: Total Stories, Published, Drafts, Photos.
  - Shortcut table with quick editing and live preview links.
- **Story Management (`/admin/articles`)**:
  - Filter by status (*All*, *Published*, *Drafts*), search by title/location, and sort by date or last updated.
  - One-click publish / unpublish toggle.
  - Permanent story deletion with modal confirmation (cascading photo records and stored image assets).
  - Responsive table layout on desktop and stacked card layout on mobile.
- **Story Composition & Editor (`/admin/articles/new` & `/admin/articles/:id/edit`)**:
  - Auto-generated clean slug with uniqueness validation and collision suffixing.
  - TipTap rich-text editor with custom styling and formatting toolbar.
  - Single cover photo uploader with client-side WebP compression and alt text field.
  - Multi-photo gallery manager with drag & drop, per-image delete, up/down reordering, and individual captions.
  - **Save Draft**, **Preview in New Tab**, and **Publish** (with celebration confetti effect!).
- **Profile Manager (`/admin/profile`)**: Update author display name, biography, and portrait photograph.
- **Social Links Settings (`/admin/settings`)**: Configure Instagram, YouTube, Pinterest, and Facebook URLs with instant synchronization.

---

