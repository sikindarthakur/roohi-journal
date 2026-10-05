import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { SiteConfigProvider } from '@/hooks/useSiteConfig';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';

// Eager Public Landing Page for Instant LCP
import { Home } from '@/pages/Home';

// Lazy Loaded Secondary Public Pages
const Stories = lazy(() => import('@/pages/Stories').then(m => ({ default: m.Stories })));
const StoryDetail = lazy(() => import('@/pages/StoryDetail').then(m => ({ default: m.StoryDetail })));
const GalleryPage = lazy(() => import('@/pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

// Lazy Loaded Admin Pages (Isolated Chunking - Section 14)
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminArticles = lazy(() => import('@/pages/admin/AdminArticles').then(m => ({ default: m.AdminArticles })));
const AdminCreateEditArticle = lazy(() => import('@/pages/admin/AdminCreateEditArticle').then(m => ({ default: m.AdminCreateEditArticle })));
const AdminProfile = lazy(() => import('@/pages/admin/AdminProfile').then(m => ({ default: m.AdminProfile })));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0d11] text-stone-200 selection:bg-amber-500/30 selection:text-amber-200">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:slug" element={<StoryDetail />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/new" element={<AdminCreateEditArticle />} />
            <Route path="/admin/articles/:id/edit" element={<AdminCreateEditArticle />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
