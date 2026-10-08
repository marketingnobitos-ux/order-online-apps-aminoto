import { createClient } from '@supabase/supabase-js';

// Kredensial dibaca dari env Vite (lihat .env.example).
// Kalau belum diset, supabase = null dan app tetap jalan (order tetap via WA).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
