-- =====================================================
-- Update Polaroid Photo Prints Pricing Structure
-- =====================================================
-- This script updates the Polaroid product with new quantity
-- options and pricing: 9, 18, 27, 36 prints
--
-- New Pricing:
-- - 9 prints: ₹199
-- - 18 prints: ₹250
-- - 27 prints: ₹350
-- - 36 prints: ₹450
--
-- Author: Chinggizz Development Team
-- Date: 2026-01-22
-- =====================================================

-- Update the product with new pricing structure
UPDATE products
SET 
    price = 199.00,
    customization_charge = 0,
    customization_options = '{"type":"polaroid","hasPhotoUpload":true,"pricePerUnit":0,"options":[{"category":"Quantity","choices":[{"name":"9 Prints","quantity":9,"price":0},{"name":"18 Prints","quantity":18,"price":51},{"name":"27 Prints","quantity":27,"price":151},{"name":"36 Prints","quantity":36,"price":251}]}]}'::text,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'Polaroid Photo Prints';

-- Verify the update
SELECT
    id,
    name,
    price,
    customization_charge,
    customization_options,
    updated_at
FROM products
WHERE name = 'Polaroid Photo Prints';

-- Expected result:
-- Base price: ₹199 (for 9 prints)
-- 18 prints: ₹199 + ₹51 = ₹250
-- 27 prints: ₹199 + ₹151 = ₹350
-- 36 prints: ₹199 + ₹251 = ₹450

