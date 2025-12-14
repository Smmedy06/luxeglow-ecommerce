-- Add slug column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create index for slug
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Generate slugs for existing products (if any)
UPDATE products 
SET slug = lower(regexp_replace(
  regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
  '\s+', '-', 'g'
)) || '-' || id
WHERE slug IS NULL;

-- Make slug unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_unique ON products(slug);

