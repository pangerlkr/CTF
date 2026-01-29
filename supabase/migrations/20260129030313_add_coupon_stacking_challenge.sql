/*
  # Add Coupon Stacking Abuse Challenge

  1. New Challenge
    - Title: Coupon Stacking Abuse
    - Slug: coupon-stacking
    - Category: Logic Flaws
    - Difficulty: medium
    - Points: 200
    - Flag: NCG{stack_coupons_for_free_items}
    - Description: Multiple discount coupons can be applied in ways the developers didn't intend. Stack coupons to get items for free.
  
  2. Notes
    - This challenge demonstrates a common e-commerce vulnerability
    - Tests understanding of business logic flaws
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
  'Coupon Stacking Abuse',
  'coupon-stacking',
  'Logic Flaws',
  'medium',
  'Multiple discount coupons can be applied in ways the developers didn''t intend. Stack coupons to get items for free.',
  200,
  'NCG{stack_coupons_for_free_items}',
  true
)
ON CONFLICT (slug) DO NOTHING;