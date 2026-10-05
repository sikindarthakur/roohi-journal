import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0d11] flex items-center justify-center px-6 py-32 text-center">
      <SEO title="Page Not Found" />

      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-6 text-amber-500">
          <Compass className="w-8 h-8" />
        </div>

        <span className="font-cinzel text-5xl sm:text-6xl text-stone-600 block mb-2">404</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 mb-4 font-normal">
          Uncharted Territory
        </h1>
        <p className="text-stone-400 text-sm leading-relaxed mb-8">
          The path you took leads nowhere. Perhaps the story moved or the coordinates were mistyped.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-amber-500 text-stone-950 font-semibold text-xs tracking-[0.2em] uppercase hover:bg-amber-400 transition-colors shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journal Home
        </Link>
      </div>
    </main>
  );
};
