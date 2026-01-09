-- Fix blog featured_image column to support longer URLs
-- Change from VARCHAR(255) to TEXT to support Supabase Storage URLs and base64 images

ALTER TABLE blogs 
ALTER COLUMN featured_image TYPE TEXT;

-- Add comment
COMMENT ON COLUMN blogs.featured_image IS 'URL to featured image (Supabase Storage URL or external URL). Supports longer URLs than VARCHAR(255).';

