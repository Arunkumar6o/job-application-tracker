import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-or-publishable-key-here'
);

// Fallback dummy values to prevent instantiation errors if not yet configured
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
