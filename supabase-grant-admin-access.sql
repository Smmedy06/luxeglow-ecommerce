-- ============================================
-- GRANT ADMIN ACCESS TO USER
-- ============================================
-- User ID: 06a7ae47-e4bc-4370-8532-f1278cd120b5
-- Email: hamzaraies.2005@gmail.com
-- ============================================

-- First, ensure the user_profiles record exists
-- If it doesn't exist, create it with admin access
INSERT INTO user_profiles (user_id, full_name, is_admin)
VALUES (
  '06a7ae47-e4bc-4370-8532-f1278cd120b5',
  'Hamza Raies',
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_admin = true,
  updated_at = NOW();

-- Verify the update
SELECT 
  user_id,
  full_name,
  is_admin,
  created_at,
  updated_at
FROM user_profiles
WHERE user_id = '06a7ae47-e4bc-4370-8532-f1278cd120b5';


