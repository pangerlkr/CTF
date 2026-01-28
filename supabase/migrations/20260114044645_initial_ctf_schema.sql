/*
  # NEXUSCIPHERGUARD INDIA - CTF Platform Schema

  ## Overview
  Creates the complete database schema for the CTF training platform including user profiles, 
  challenges, solves tracking, and admin management.

  ## 1. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, required)
  - `total_points` (integer, default 0)
  - `is_admin` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `challenges`
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `slug` (text, unique, required)
  - `category` (text, required)
  - `difficulty` (text, required - easy/medium/hard)
  - `description` (text, required)
  - `points` (integer, required)
  - `flag` (text, required)
  - `file_url` (text, optional - for downloadable challenges)
  - `sandbox_url` (text, optional - for web challenges)
  - `hints` (jsonb, optional)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `solves`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `challenge_id` (uuid, references challenges)
  - `solved_at` (timestamptz)
  - Composite unique constraint on (user_id, challenge_id)
  
  ### `flag_attempts`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `challenge_id` (uuid, references challenges)
  - `attempted_at` (timestamptz)
  - Used for rate limiting

  ## 2. Security
  - Enable RLS on all tables
  - Profiles: Users can read all profiles, update only their own (except admin fields)
  - Challenges: All authenticated users can read active challenges, only admins can modify
  - Solves: Users can read all solves, insert only their own
  - Flag attempts: Users can only insert their own attempts, admins can read all

  ## 3. Functions
  - Auto-create profile on user signup
  - Update user points when solve is recorded
  
  ## 4. Indexes
  - Index on challenge category and difficulty for filtering
  - Index on solves for leaderboard queries
  - Index on flag attempts for rate limiting
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  total_points integer DEFAULT 0 CHECK (total_points >= 0),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description text NOT NULL,
  points integer NOT NULL CHECK (points > 0),
  flag text NOT NULL,
  file_url text,
  sandbox_url text,
  hints jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create solves table
CREATE TABLE IF NOT EXISTS solves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  solved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create flag_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS flag_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  attempted_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_solves_user_id ON solves(user_id);
CREATE INDEX IF NOT EXISTS idx_solves_challenge_id ON solves(challenge_id);
CREATE INDEX IF NOT EXISTS idx_solves_solved_at ON solves(solved_at DESC);
CREATE INDEX IF NOT EXISTS idx_flag_attempts_user_challenge ON flag_attempts(user_id, challenge_id, attempted_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE solves ENABLE ROW LEVEL SECURITY;
ALTER TABLE flag_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Challenges policies
CREATE POLICY "Authenticated users can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can insert challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can update challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can delete challenges"
  ON challenges FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Solves policies
CREATE POLICY "Users can view all solves"
  ON solves FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own solves"
  ON solves FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Flag attempts policies
CREATE POLICY "Users can insert their own flag attempts"
  ON flag_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all flag attempts"
  ON flag_attempts FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user points when a solve is recorded
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET total_points = total_points + (SELECT points FROM challenges WHERE id = NEW.challenge_id)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update points on solve
DROP TRIGGER IF EXISTS on_solve_created ON solves;
CREATE TRIGGER on_solve_created
  AFTER INSERT ON solves
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();
