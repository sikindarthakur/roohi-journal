import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { loginWithEmail, logoutUser, getCurrentUser, subscribeToAuthChanges } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, error: null }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initUser() {
      try {
        const u = await getCurrentUser();
        if (mounted) setUser(u);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initUser();

    const unsubscribe = subscribeToAuthChanges((newUser) => {
      if (mounted) {
        setUser(newUser);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const result = await loginWithEmail(email, pass);
    setIsLoading(false);

    if (result.user) {
      setUser(result.user);
      return { success: true, error: null };
    }
    return { success: false, error: result.error || 'Login failed' };
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutUser();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
