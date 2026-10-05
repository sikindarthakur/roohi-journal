import { supabase, isSupabaseConfigured } from './supabase';
import { User, Session } from '@supabase/supabase-js';

const MOCK_SESSION_KEY = 'roohi_auth_session';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export async function loginWithEmail(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    // Local admin credentials fallback for demonstration
    if (email.toLowerCase().trim() === 'roohi@example.com' || email.toLowerCase().trim() === 'admin@roohi.photo' || password.length >= 6) {
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: email.trim(),
        user_metadata: { name: 'Roohi' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user: mockUser,
        expires_at: Math.floor(Date.now() / 1000) + 86400 * 7,
      } as unknown as Session;

      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockSession));
      return { user: mockUser, error: null };
    }
    return { user: null, error: 'Invalid email or password. Minimum 6 characters required.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'An unexpected authentication error occurred.' };
  }
}

export async function logoutUser(): Promise<void> {
  if (!isSupabaseConfigured) {
    localStorage.removeItem(MOCK_SESSION_KEY);
    return;
  }
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) {
    const saved = localStorage.getItem(MOCK_SESSION_KEY);
    if (saved) {
      try {
        const session = JSON.parse(saved);
        return session.user;
      } catch {
        return null;
      }
    }
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!isSupabaseConfigured) {
    const checkStorage = () => {
      const saved = localStorage.getItem(MOCK_SESSION_KEY);
      callback(saved ? JSON.parse(saved).user : null);
    };

    window.addEventListener('storage', checkStorage);
    return () => window.removeEventListener('storage', checkStorage);
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return () => {
    subscription.unsubscribe();
  };
}
