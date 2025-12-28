-- Update Categories - Remove old and add new
-- First, delete old categories
DELETE FROM categories WHERE name NOT IN ('Filler', 'Premium Filler', 'Body Kit/Filler', 'Skin Boosters', 'Fat Dissolvers', 'Eye Meso', 'Needles');

-- Insert new categories if they don't exist
INSERT INTO categories (name, slug, is_active) VALUES
  ('Filler', 'filler', true),
  ('Premium Filler', 'premium-filler', true),
  ('Body Kit/Filler', 'body-kit-filler', true),
  ('Skin Boosters', 'skin-boosters', true),
  ('Fat Dissolvers', 'fat-dissolvers', true),
  ('Eye Meso', 'eye-meso', true),
  ('Needles', 'needles', true)
ON CONFLICT (name) DO UPDATE SET is_active = true;

-- Update Brands - Remove old and add new
-- First, delete old brands
DELETE FROM brands WHERE name NOT IN (
  'Ami Eyes', 'Eyebella', 'Flawless', 'Hyaron', 'Jalupro', 'Juvederm', 
  'Lemon Bottle', 'Lumi', 'Lumi Eyes', 'Luxfill', 'NanoImpact 8', 'Neuramis', 
  'Nucleofill', 'Plinest', 'Profhilo', 'Pure', 'Regenovue', 'Revitrane', 
  'Revolax', 'Revs Pro', 'Seventy Hyal', 'Stylage', 'Teoxane', 'Vitaran'
);

-- Insert new brands if they don't exist
INSERT INTO brands (name, slug, is_active) VALUES
  ('Ami Eyes', 'ami-eyes', true),
  ('Eyebella', 'eyebella', true),
  ('Flawless', 'flawless', true),
  ('Hyaron', 'hyaron', true),
  ('Jalupro', 'jalupro', true),
  ('Juvederm', 'juvederm', true),
  ('Lemon Bottle', 'lemon-bottle', true),
  ('Lumi', 'lumi', true),
  ('Lumi Eyes', 'lumi-eyes', true),
  ('Luxfill', 'luxfill', true),
  ('NanoImpact 8', 'nanoimpact-8', true),
  ('Neuramis', 'neuramis', true),
  ('Nucleofill', 'nucleofill', true),
  ('Plinest', 'plinest', true),
  ('Profhilo', 'profhilo', true),
  ('Pure', 'pure', true),
  ('Regenovue', 'regenovue', true),
  ('Revitrane', 'revitrane', true),
  ('Revolax', 'revolax', true),
  ('Revs Pro', 'revs-pro', true),
  ('Seventy Hyal', 'seventy-hyal', true),
  ('Stylage', 'stylage', true),
  ('Teoxane', 'teoxane', true),
  ('Vitaran', 'vitaran', true)
ON CONFLICT (name) DO UPDATE SET is_active = true;

