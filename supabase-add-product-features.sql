-- Add product_features column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}'::TEXT[];

-- Add other useful e-commerce fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS on_sale BOOLEAN DEFAULT false;

