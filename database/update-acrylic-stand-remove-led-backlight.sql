-- =====================================================
-- Remove LED Backlight Option from Acrylic Photo Stand
-- =====================================================
-- This script removes the "LED Backlight" customization option
-- from the Acrylic Photo Stand product, leaving only "Size" option.
--
-- Author: Chinggizz Development Team
-- Date: 2026-01-22
-- =====================================================

-- Update the product customization options
UPDATE products
SET customization_options = '{"type":"stand","hasPhotoUpload":true,"options":[{"category":"Size","choices":[{"name":"Small (4×6 inch)","price":0,"width":10,"height":15},{"name":"Medium (6×8 inch)","price":150,"width":15,"height":20},{"name":"Large (8×10 inch)","price":300,"width":20,"height":25}]}]}'::text,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'Acrylic Photo Stand';

-- Verify the update
SELECT
    id,
    name,
    price,
    customization_charge,
    customization_options,
    updated_at
FROM products
WHERE name = 'Acrylic Photo Stand';

-- Expected result:
-- The customization_options should now only contain "Size" category
-- No "LED Backlight" category should be present

