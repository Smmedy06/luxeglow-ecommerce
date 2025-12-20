-- ============================================
-- VERIFY ADMIN SETUP
-- ============================================
-- Run this to check if the admin user is set up correctly
-- ============================================

-- Check if user profile exists and has admin access
SELECT 
  'User Profile' as check_type,
  user_id,
  full_name,
  is_admin,
  CASE 
    WHEN is_admin = true THEN '✅ Admin access granted'
    ELSE '❌ Admin access NOT granted'
  END as status,
  created_at,
  updated_at
FROM user_profiles
WHERE user_id = '06a7ae47-e4bc-4370-8532-f1278cd120b5';

-- Check if is_admin() function exists
SELECT 
  'Function Check' as check_type,
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name = 'is_admin' THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';

-- Check function permissions
SELECT 
  'Function Permissions' as check_type,
  routine_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';


