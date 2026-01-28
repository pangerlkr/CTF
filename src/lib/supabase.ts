import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  total_points: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  points: number;
  flag: string;
  file_url?: string;
  sandbox_url?: string;
  hints?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Solve = {
  id: string;
  user_id: string;
  challenge_id: string;
  solved_at: string;
};

export type LeaderboardEntry = {
  username: string;
  total_points: number;
  solve_count: number;
  last_solve: string | null;
};
