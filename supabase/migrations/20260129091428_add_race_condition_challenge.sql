/*
  # Add Loyalty Points Race Condition Challenge

  1. New Challenge
    - Title: Loyalty Points Race Condition
    - Slug: race-condition-points
    - Category: Logic Flaws
    - Difficulty: hard
    - Points: 300
    - Flag: NCG{r4c3_c0nd1t10n_p01nt5_dupl1c4t3d}
    - Description: A loyalty points system doesn't handle concurrent requests properly. Exploit a race condition to duplicate points.
  
  2. Notes
    - This challenge demonstrates a race condition vulnerability
    - Tests understanding of concurrent request handling
    - Includes interactive simulation
*/

INSERT INTO challenges (
  title,
  slug,
  category,
  difficulty,
  description,
  points,
  flag,
  is_active
) VALUES (
  'Loyalty Points Race Condition',
  'race-condition-points',
  'Logic Flaws',
  'hard',
  'A loyalty points system doesn''t handle concurrent requests properly. Exploit a race condition to duplicate points.',
  300,
  'NCG{r4c3_c0nd1t10n_p01nt5_dupl1c4t3d}',
  true
)
ON CONFLICT (slug) DO NOTHING;
