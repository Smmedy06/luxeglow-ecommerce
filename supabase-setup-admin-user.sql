-- ============================================
-- COMPLETE SETUP FOR ADMIN USER
-- ============================================
-- User ID: 06a7ae47-e4bc-4370-8532-f1278cd120b5
-- Email: hamzaraies.2005@gmail.com
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure the is_admin column exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Step 2: Create or update the user profile with admin access
INSERT INTO user_profiles (user_id, full_name, is_admin)
VALUES (
  '06a7ae47-e4bc-4370-8532-f1278cd120b5',
  'Hamza Raies',
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_admin = true,
  full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
  updated_at = NOW();

-- Step 3: Ensure the is_admin() function exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE user_id = auth.uid()),
    false
  ) INTO admin_status;
  
  RETURN admin_status;
END;
$$;

-- Step 4: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- Step 5: Verify the setup
SELECT 
  'User Profile Check' as check_type,
  user_id,
  full_name,
  is_admin,
  created_at,
  updated_at
FROM user_profiles
WHERE user_id = '06a7ae47-e4bc-4370-8532-f1278cd120b5';

-- Step 6: Test the is_admin() function (this will return false if not logged in, but that's OK)
SELECT 
  'Function Test' as check_type,
  is_admin() as admin_status;


