-- Update Customised Photo Mug product pricing
-- Individual Mug should be ₹299, Couple Mugs should be ₹499 (₹299 + ₹200)

-- First, check the current state
SELECT id, name, price, customization_charge, customization_options FROM products WHERE name = 'Customised Photo Mug';

-- Update the mug product with correct pricing
UPDATE products
SET 
  price = 299,
  customization_charge = 0,
  customization_options = '{"type":"mug","hasPhotoUpload":true,"options":[{"category":"Type","choices":[{"name":"Individual Mug","price":0,"description":"Single mug with one photo"},{"name":"Couple Mugs (Set of 2)","price":200,"description":"Matching pair of mugs"}]}]}'::jsonb
WHERE name = 'Customised Photo Mug';

-- Verify the update
SELECT 
  id, 
  name, 
  price,
  customization_charge,
  customization_options 
FROM products 
WHERE name = 'Customised Photo Mug';

