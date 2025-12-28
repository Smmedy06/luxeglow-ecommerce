-- Add short_description field to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Remove SKU, weight, and dimensions columns (if they exist)
ALTER TABLE products 
DROP COLUMN IF EXISTS sku,
DROP COLUMN IF EXISTS weight,
DROP COLUMN IF EXISTS dimensions;

