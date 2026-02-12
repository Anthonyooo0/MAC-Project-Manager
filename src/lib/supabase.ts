import { createClient } from '@supabase/supabase-js';

// Supabase credentials - update these with your actual project
// anon key is designed to be public (client-side)
// Security is enforced via Row Level Security (RLS) policies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
