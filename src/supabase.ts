import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim().replace(/^["']|["']$/g, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  try {
    const parsed = new URL(url);
    // Return standard origin e.g. https://xxx.supabase.co
    return parsed.origin;
  } catch {
    return '';
  }
}

function sanitizeKey(rawKey: string): string {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
}

const rawUrl = env.VITE_SUPABASE_URL || '';
const rawKey = env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = sanitizeKey(rawKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey.length > 20
);

// Initialize Supabase Client safely with full OAuth & Session detection
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : createClient('https://mock-fursad-db.supabase.co', 'mock-anon-key-fursad-platform-2026-safe', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

export const PROJECT_OWNER_EMAILS = ['somfxstore@gmail.com', 'hamze.zakarie@gmail.com'];
export const isProjectOwner = (email?: string): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return PROJECT_OWNER_EMAILS.some(e => e.toLowerCase() === clean);
};

export const PROJECT_OWNER_EMAIL = 'somfxstore@gmail.com';

export default supabase;

