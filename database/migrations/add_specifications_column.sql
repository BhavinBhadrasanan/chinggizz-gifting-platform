-- Migration: Add specifications column to products table
-- Date: 2026-01-28
-- Description: Adds a TEXT column to store product specifications in JSON or plain text format

-- Add specifications column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'specifications'
    ) THEN
        ALTER TABLE products ADD COLUMN specifications TEXT;
        RAISE NOTICE 'Column specifications added to products table';
    ELSE
        RAISE NOTICE 'Column specifications already exists in products table';
    END IF;
END $$;

-- Update existing products with sample specifications (optional)
-- You can customize this based on your product categories

-- Example: Update mugs with specifications
UPDATE products 
SET specifications = '{"Material": "Ceramic", "Capacity": "350ml", "Care": "Dishwasher safe", "Microwave Safe": "Yes"}'
WHERE product_type = 'CUSTOMISED_ITEM' 
  AND name LIKE '%Mug%' 
  AND specifications IS NULL;

-- Example: Update photo frames with specifications
UPDATE products 
SET specifications = '{"Material": "Wood/Acrylic", "Orientation": "Portrait/Landscape", "Mounting": "Wall mount or stand"}'
WHERE product_type = 'CUSTOMISED_ITEM' 
  AND name LIKE '%Frame%' 
  AND specifications IS NULL;

-- Example: Update t-shirts with specifications
UPDATE products 
SET specifications = '{"Material": "100% Cotton", "Fit": "Regular", "Care": "Machine wash cold", "Sizes": "S, M, L, XL, XXL"}'
WHERE product_type = 'CUSTOMISED_ITEM' 
  AND name LIKE '%T-Shirt%' 
  AND specifications IS NULL;

-- Example: Update chocolates with specifications
UPDATE products 
SET specifications = '{"Type": "Premium Chocolate", "Weight": "Varies", "Storage": "Cool, dry place", "Shelf Life": "6 months"}'
WHERE product_type = 'EDIBLE' 
  AND name LIKE '%Chocolate%' 
  AND specifications IS NULL;

-- Verify the migration
SELECT 
    COUNT(*) as total_products,
    COUNT(specifications) as products_with_specs,
    COUNT(*) - COUNT(specifications) as products_without_specs
FROM products;

-- Show sample of updated products
SELECT id, name, specifications 
FROM products 
WHERE specifications IS NOT NULL 
LIMIT 5;

