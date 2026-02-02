-- Update Customised Caricature product with new size options
-- This script updates the existing caricature product to use the new size dimensions
-- instead of A4, A3, A2 paper sizes

-- Find the caricature product ID first
-- SELECT id, name, customization_options FROM products WHERE name LIKE '%Caricature%';

-- First, let's check the current state
SELECT id, name, price, customization_options FROM products WHERE name = 'Customised Caricature';

-- Update the customization options with new sizes and pricing
UPDATE products
SET
  price = 900,
  customization_charge = 0,
  customization_options = '{"type":"caricature","hasPhotoUpload":true,"options":[{"category":"Type","choices":[{"name":"Individual","price":0,"description":"Single person caricature"},{"name":"Couple","price":200,"description":"Two people caricature"}]},{"category":"Size","choices":[{"name":"22.5 cm × 9 cm","price":0,"width":22.5,"height":9}]}]}'::jsonb
WHERE name = 'Customised Caricature';

-- Verify the update
SELECT 
  id, 
  name, 
  price,
  customization_options 
FROM products 
WHERE name = 'Customised Caricature';

