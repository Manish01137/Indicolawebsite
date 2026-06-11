import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client — reads URL + anon key from Vite env at build time.
 * Anon key is safe to ship in the browser; Row Level Security on the
 * server enforces who can read/write/delete.
 */
const url     = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/* Tiny helpers — keep the rest of the app clean */
export const REVIEWS_TABLE = 'reviews'
