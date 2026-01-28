DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'additional_images'
    ) THEN
        ALTER TABLE products ADD COLUMN additional_images TEXT;
        RAISE NOTICE 'Column additional_images added to products table';
    ELSE
        RAISE NOTICE 'Column additional_images already exists in products table';
    END IF;
END $$;

SELECT
    COUNT(*) as total_products,
    COUNT(additional_images) as products_with_additional_images,
    COUNT(*) - COUNT(additional_images) as products_without_additional_images
FROM products;

SELECT id, name, image_url, additional_images
FROM products
LIMIT 5;

