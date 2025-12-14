-- Add images column to products table for multiple image support
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::TEXT[];

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN(images);

