import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in (PRD Section 7)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090b0e] flex flex-col justify-center py-12 px-6 sm:px-8 relative overflow-hidden">
      <SEO title="Admin Login • Studio Control" />

      {/* Ambient background accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Journal
        </Link>

        {/* Brand */}
        <div className="text-center mb-8">
          <span className="font-cinzel text-3xl sm:text-4xl tracking-[0.25em] font-medium text-stone-100 uppercase block mb-2">
            ROOHI
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-500 font-semibold">
            Studio Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#11141b] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-stone-800">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
                Owner Authentication
              </h2>
              <p className="text-xs text-stone-400">Sign in to manage stories and photographs</p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="roohi@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-400 mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Studio</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-stone-800/80 text-center">
            <p className="text-[11px] text-stone-500">
              Secured with Supabase Row Level Security & JWT Authentication.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
