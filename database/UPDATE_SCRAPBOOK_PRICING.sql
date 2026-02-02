-- Update Handmade Scrapbook product pricing
-- Base price should be ₹750 (Mini size included)
-- Small (10 pages): ₹750 + ₹200 = ₹950
-- Medium (20 pages): ₹750 + ₹400 = ₹1150

-- First, check the current state
SELECT id, name, price, customization_charge, customization_options FROM products WHERE name = 'Handmade Scrapbook';

-- Update the scrapbook product with correct pricing
UPDATE products
SET 
  price = 750,
  customization_charge = 0,
  customization_options = '{"type":"scrapbook","hasPhotoUpload":true,"options":[{"category":"Size","choices":[{"name":"Mini (5 pages)","price":0,"description":"Perfect for a special moment"},{"name":"Small (10 pages)","price":200,"description":"Great for special occasions"},{"name":"Medium (20 pages)","price":400,"description":"Complete memory collection"}]},{"category":"Theme","choices":[{"name":"Love & Romance","price":0,"description":"Hearts and romantic designs"},{"name":"Travel Adventures","price":0,"description":"Maps and travel motifs"},{"name":"Birthday Celebration","price":0,"description":"Festive birthday theme"},{"name":"Wedding Memories","price":200,"description":"Elegant wedding designs"},{"name":"Baby Moments","price":100,"description":"Cute baby-themed pages"}]}]}'::jsonb
WHERE name = 'Handmade Scrapbook';

-- Verify the update
SELECT 
  id, 
  name, 
  price,
  customization_charge,
  customization_options 
FROM products 
WHERE name = 'Handmade Scrapbook';

