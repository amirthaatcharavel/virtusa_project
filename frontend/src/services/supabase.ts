import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default environment variables or localStorage overrides
const getEnvOrStorage = (key: string, envVal?: string): string => {
  return localStorage.getItem(key) || envVal || '';
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  const url = getEnvOrStorage('supabase_url', import.meta.env.VITE_SUPABASE_URL);
  const anonKey = getEnvOrStorage('supabase_anon_key', import.meta.env.VITE_SUPABASE_ANON_KEY);
  return { url, anonKey };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('https://') && url.includes('supabase.co'));
};

export const initSupabase = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('https://')) {
    supabaseInstance = null;
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseInstance = null;
    return null;
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    return initSupabase();
  }
  return supabaseInstance;
};

export const saveSupabaseCredentials = (url: string, anonKey: string): boolean => {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();
    localStorage.setItem('supabase_url', trimmedUrl);
    localStorage.setItem('supabase_anon_key', trimmedKey);
    supabaseInstance = null; // Re-create with new credentials
    initSupabase();
    return true;
  } catch (err) {
    console.error('Failed saving Supabase credentials:', err);
    return false;
  }
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
  supabaseInstance = null;
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; latencyMs?: number }> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL and Anon Public Key are required. Please configure credentials.',
    };
  }

  const start = performance.now();
  try {
    // Try pinging users or audit_events table
    const { error } = await client.from('users').select('id').limit(1);
    const latency = Math.round(performance.now() - start);

    if (error) {
      // If table doesn't exist yet, we still reached the Supabase gateway
      if (error.code === 'PGRST204' || error.message?.includes('relation "public.users" does not exist')) {
        return {
          success: true,
          message: `Connected to Supabase project (${latency}ms)! Database tables need to be created using supabase_schema.sql.`,
          latencyMs: latency,
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message} (${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase PostgreSQL (${latency}ms)! Read access verified.`,
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error reaching Supabase endpoint.',
    };
  }
};

// Initialize on import
initSupabase();
