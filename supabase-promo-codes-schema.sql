-- ============================================
-- PROMO CODES TABLE SETUP
-- ============================================
-- Create promo_codes table for managing discount codes
-- Run this in Supabase SQL Editor

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10,2) CHECK (discount_amount >= 0),
  -- Use percentage OR amount, not both
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER, -- Total times code can be used (null = unlimited)
  usage_count INTEGER DEFAULT 0, -- Current usage count
  user_usage_limit INTEGER DEFAULT 1, -- Times a single user can use this code
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until ON promo_codes(valid_until);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view active promo codes (for validation)
CREATE POLICY "Active promo codes are viewable by everyone" ON promo_codes
  FOR SELECT USING (is_active = true);

-- Admins can manage all promo codes
CREATE POLICY "Admins can manage promo codes" ON promo_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create table to track promo code usage per user
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id SERIAL PRIMARY KEY,
  promo_code_id INTEGER REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id, order_id)
);

-- Create index for promo code usage
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_promo_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user_id ON promo_code_usage(user_id);

-- Enable RLS on usage table
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own promo code usage" ON promo_code_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all promo code usage" ON promo_code_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- System can insert usage records (via service role)
CREATE POLICY "System can insert promo code usage" ON promo_code_usage
  FOR INSERT WITH CHECK (true);

-- Function to increment promo code usage count
CREATE OR REPLACE FUNCTION increment_promo_code_usage(promo_code_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promo_codes
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = promo_code_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_promo_code_usage(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_promo_code_usage(INTEGER) TO anon;

