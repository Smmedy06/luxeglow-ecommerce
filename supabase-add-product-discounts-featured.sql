-- Add quantity discount fields and featured status to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage_5_9 DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_percentage_10_plus DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;

