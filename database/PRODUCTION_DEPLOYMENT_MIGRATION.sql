-- ============================================================================
-- CHINGGIZZ PRODUCTION DEPLOYMENT - COMPLETE DATABASE MIGRATION
-- ============================================================================
-- Run this script in Supabase SQL Editor to ensure all columns exist
-- This script is IDEMPOTENT - safe to run multiple times
-- ============================================================================

-- 1. Add specifications column to products table (if not exists)
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

-- 2. Add additional_images column to products table (if not exists)
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

-- 3. Add screenshot column to order_hampers table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'order_hampers' 
        AND column_name = 'screenshot'
    ) THEN
        ALTER TABLE order_hampers ADD COLUMN screenshot TEXT;
        RAISE NOTICE 'Column screenshot added to order_hampers table';
    ELSE
        RAISE NOTICE 'Column screenshot already exists in order_hampers table';
    END IF;
END $$;

-- 4. Add product dimension columns (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'width_cm'
    ) THEN
        ALTER TABLE products ADD COLUMN width_cm DECIMAL(10, 2);
        RAISE NOTICE 'Column width_cm added to products table';
    ELSE
        RAISE NOTICE 'Column width_cm already exists in products table';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'height_cm'
    ) THEN
        ALTER TABLE products ADD COLUMN height_cm DECIMAL(10, 2);
        RAISE NOTICE 'Column height_cm added to products table';
    ELSE
        RAISE NOTICE 'Column height_cm already exists in products table';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'depth_cm'
    ) THEN
        ALTER TABLE products ADD COLUMN depth_cm DECIMAL(10, 2);
        RAISE NOTICE 'Column depth_cm added to products table';
    ELSE
        RAISE NOTICE 'Column depth_cm already exists in products table';
    END IF;
END $$;

-- 5. Add hamper box dimension columns (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'hamper_boxes' 
        AND column_name = 'length_cm'
    ) THEN
        ALTER TABLE hamper_boxes ADD COLUMN length_cm DECIMAL(5, 2);
        RAISE NOTICE 'Column length_cm added to hamper_boxes table';
    ELSE
        RAISE NOTICE 'Column length_cm already exists in hamper_boxes table';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hamper_boxes'
        AND column_name = 'width_cm'
    ) THEN
        ALTER TABLE hamper_boxes ADD COLUMN width_cm DECIMAL(5, 2);
        RAISE NOTICE 'Column width_cm added to hamper_boxes table';
    ELSE
        RAISE NOTICE 'Column width_cm already exists in hamper_boxes table';
    END IF;
END $$;

-- 6. Add hamper box height column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hamper_boxes'
        AND column_name = 'height_cm'
    ) THEN
        ALTER TABLE hamper_boxes ADD COLUMN height_cm DECIMAL(5, 2);
        RAISE NOTICE 'Column height_cm added to hamper_boxes table';
    ELSE
        RAISE NOTICE 'Column height_cm already exists in hamper_boxes table';
    END IF;
END $$;

-- 7. Add hamper box grid columns (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hamper_boxes'
        AND column_name = 'grid_rows'
    ) THEN
        ALTER TABLE hamper_boxes ADD COLUMN grid_rows INTEGER DEFAULT 2;
        RAISE NOTICE 'Column grid_rows added to hamper_boxes table';
    ELSE
        RAISE NOTICE 'Column grid_rows already exists in hamper_boxes table';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hamper_boxes'
        AND column_name = 'grid_cols'
    ) THEN
        ALTER TABLE hamper_boxes ADD COLUMN grid_cols INTEGER DEFAULT 3;
        RAISE NOTICE 'Column grid_cols added to hamper_boxes table';
    ELSE
        RAISE NOTICE 'Column grid_cols already exists in hamper_boxes table';
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all products columns exist
SELECT
    'products' as table_name,
    COUNT(*) FILTER (WHERE column_name = 'specifications') as has_specifications,
    COUNT(*) FILTER (WHERE column_name = 'additional_images') as has_additional_images,
    COUNT(*) FILTER (WHERE column_name = 'width_cm') as has_width_cm,
    COUNT(*) FILTER (WHERE column_name = 'height_cm') as has_height_cm,
    COUNT(*) FILTER (WHERE column_name = 'depth_cm') as has_depth_cm
FROM information_schema.columns
WHERE table_name = 'products';

-- Verify all hamper_boxes columns exist
SELECT
    'hamper_boxes' as table_name,
    COUNT(*) FILTER (WHERE column_name = 'length_cm') as has_length_cm,
    COUNT(*) FILTER (WHERE column_name = 'width_cm') as has_width_cm,
    COUNT(*) FILTER (WHERE column_name = 'height_cm') as has_height_cm,
    COUNT(*) FILTER (WHERE column_name = 'grid_rows') as has_grid_rows,
    COUNT(*) FILTER (WHERE column_name = 'grid_cols') as has_grid_cols
FROM information_schema.columns
WHERE table_name = 'hamper_boxes';

-- Verify order_hampers screenshot column exists
SELECT
    'order_hampers' as table_name,
    COUNT(*) FILTER (WHERE column_name = 'screenshot') as has_screenshot
FROM information_schema.columns
WHERE table_name = 'order_hampers';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 Check the verification queries above to confirm all columns exist';
    RAISE NOTICE '🚀 Your database is now ready for deployment!';
END $$;
