-- Fix infinite recursion in RLS policies
-- This script fixes the issue where user_profiles policies cause infinite recursion

-- IMPORTANT: Drop all policies that depend on is_admin() FIRST
-- before dropping the function

DROP POLICY IF EXISTS "Admins can manage users" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
DROP POLICY IF EXISTS "Admins can manage blogs" ON blogs;
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON blogs;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS is_admin();

-- Create a security definer function that bypasses RLS
-- This function runs with the privileges of the function owner (postgres)
-- and will not trigger RLS policies
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
  -- Use a direct query that bypasses RLS due to SECURITY DEFINER
  -- The function runs with postgres privileges, so RLS is bypassed
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE user_id = auth.uid()),
    false
  ) INTO admin_status;
  
  RETURN admin_status;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- Now recreate all policies using the function
-- (We already dropped them at the top, so this is safe)

CREATE POLICY "Admins can manage users" ON user_profiles
  FOR ALL 
  USING (is_admin());

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage blogs" ON blogs
  FOR ALL USING (is_admin());

CREATE POLICY "Blogs are viewable by everyone" ON blogs
  FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (is_admin());

