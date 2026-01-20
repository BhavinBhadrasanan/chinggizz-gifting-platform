-- ============================================
-- Update Wooden Engraved Photo Stand
-- Remove "Wood Type" customization option
-- ============================================

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire script
-- 5. Click "Run" to execute

-- Update the product customization options
UPDATE products
SET customization_options = '{"type":"stand","hasPhotoUpload":true,"hasEngraving":true,"options":[{"category":"Size","choices":[{"name":"Small (4×6 inch)","price":0,"width":10,"height":15},{"name":"Medium (5×7 inch)","price":150,"width":13,"height":18},{"name":"Large (8×10 inch)","price":300,"width":20,"height":25}]}]}'::text,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'Wooden Engraved Photo Stand';

-- Verify the update
SELECT
    id,
    name,
    price,
    customization_charge,
    customization_options,
    updated_at
FROM products
WHERE name = 'Wooden Engraved Photo Stand';

-- Expected result:
-- The customization_options should now only contain "Size" category
-- No "Wood Type" category should be present

