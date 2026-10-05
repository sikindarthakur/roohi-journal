import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication Guard: Redirect to /admin/login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-stone-400">Loading Admin Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Stories', path: '/admin/articles', icon: BookOpen },
    { name: 'New Story', path: '/admin/articles/new', icon: PlusCircle },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Social & Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-stone-200 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-stone-950 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xl tracking-[0.2em] font-bold text-white">ROOHI</span>
          <span className="text-[10px] tracking-widest uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-stone-300 hover:text-white rounded-lg bg-stone-900 border border-stone-800"
          aria-label="Toggle Navigation"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#080a0e] border-r border-stone-800/80 flex flex-col justify-between p-6 transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="hidden md:flex items-center justify-between mb-10 pb-6 border-b border-stone-800/80">
            <div>
              <span className="font-cinzel text-2xl tracking-[0.25em] font-medium text-stone-100 block">ROOHI</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-amber-400/80 font-medium">Studio Control</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Live Site & Logout */}
        <div className="space-y-2 pt-6 border-t border-stone-800/80">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              View Live Site
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
