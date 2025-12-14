-- ============================================
-- MAKE YOURSELF AN ADMIN
-- ============================================
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- To find your user ID:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Find your user and copy the User UID
-- 3. Replace it below

UPDATE user_profiles
SET is_admin = true
WHERE user_id = 'YOUR_USER_ID_HERE';

-- If you don't have a profile yet, create one:
-- INSERT INTO user_profiles (user_id, full_name, is_admin)
-- VALUES ('YOUR_USER_ID_HERE', 'Your Name', true)
-- ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

