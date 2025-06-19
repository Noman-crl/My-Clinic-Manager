import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signIn, signUp, signOut } from '../services/supabaseApi';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting session:', error);
        } else {
          console.log('✅ Initial session check:', session?.user ? `User: ${session.user.email}` : 'No user');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user ? `User: ${session.user.email}` : 'No user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 AuthContext: Attempting login for:', email);
      
      const { user: authUser } = await signIn(email, password);
      console.log('✅ AuthContext: Login successful');
      
      // Wait a moment for the auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setUser(authUser);
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 AuthContext: Attempting registration for:', email);
      
      const { user: authUser } = await signUp(email, password, { name });
      console.log('✅ AuthContext: Registration successful');
      
      // Wait a moment for the auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setUser(authUser);
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 AuthContext: Attempting logout');
      await signOut();
      setUser(null);
      console.log('✅ AuthContext: Logout successful');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}