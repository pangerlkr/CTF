/*
  # Allow Anonymous Leaderboard Access

  1. Changes
    - Update profiles SELECT policy to allow anonymous users
    - Update solves SELECT policy to allow anonymous users
  
  2. Security
    - Only SELECT (read) access is granted
    - Anonymous users still cannot modify data
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view all solves" ON solves;

-- Create new policies that allow anonymous access
CREATE POLICY "Public can view profiles"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Public can view all solves"
  ON solves
  FOR SELECT
  USING (true);
