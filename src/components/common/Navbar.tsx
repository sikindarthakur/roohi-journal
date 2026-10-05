import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Compass, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { profile } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Stories', path: '/stories', icon: Compass },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'About', path: '/about', icon: User },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0a0c10]/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 text-white transition-opacity hover:opacity-90"
          >
            <span className="font-cinzel text-2xl sm:text-3xl tracking-[0.25em] font-medium uppercase text-stone-100 group-hover:text-amber-300 transition-colors">
              {profile.name ? profile.name.toUpperCase() : 'ROOHI'}
            </span>
            <span className="hidden md:inline-block h-3 w-[1px] bg-stone-500/50"></span>
            <span className="hidden md:inline-block text-[11px] tracking-[0.3em] uppercase text-stone-400 font-light">
              Journal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xs tracking-[0.2em] uppercase font-medium transition-colors py-1 ${
                    isActive ? 'text-amber-400' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber-400"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Authenticated Admin Quick Link */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full hover:bg-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#0c0e13]/98 backdrop-blur-2xl border-b border-stone-800 px-6 py-8 shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 text-base tracking-[0.15em] uppercase font-medium py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 opacity-75" />
                    {link.name}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 text-base tracking-[0.15em] uppercase font-medium py-2.5 px-3 rounded-lg text-amber-300 bg-amber-500/15 border border-amber-500/30"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
