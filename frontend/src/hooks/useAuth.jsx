import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // If Supabase credentials are not set, don't crash
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Supabase Auth Error]', error);
        setAuthError(error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Register with email, password, and full name
  const register = async (email, password, fullName) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    return data;
  };

  // Login with email and password
  const login = async (email, password) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    return data;
  };

  // Logout current session
  const logout = async () => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Logout Error]', error);
      setAuthError(error.message);
      throw error;
    }

    setUser(null);
    setSession(null);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Job Seeker';

  const value = {
    user,
    session,
    loading,
    authError,
    setAuthError,
    displayName,
    isConfigured: isSupabaseConfigured,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
