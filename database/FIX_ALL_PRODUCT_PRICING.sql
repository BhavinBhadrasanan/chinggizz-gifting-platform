-- Fix ALL product pricing to match home page with customization page
-- Rule: Home page price = Customization page price (no extra charges added)
-- All customization_charge should be 0

-- 1. HANDMADE SCRAPBOOK - Mini ₹199, Small ₹349, Medium ₹499
UPDATE products
SET
  price = 199,
  customization_charge = 0,
  customization_options = '{"type":"scrapbook","hasPhotoUpload":true,"options":[{"category":"Size","choices":[{"name":"Mini (5 pages)","price":0,"description":"Perfect for a special moment"},{"name":"Small (10 pages)","price":150,"description":"Great for special occasions"},{"name":"Medium (20 pages)","price":300,"description":"Complete memory collection"}]},{"category":"Theme","choices":[{"name":"Love & Romance","price":0,"description":"Hearts and romantic designs"},{"name":"Travel Adventures","price":0,"description":"Maps and travel motifs"},{"name":"Birthday Celebration","price":0,"description":"Festive birthday theme"},{"name":"Wedding Memories","price":0,"description":"Elegant wedding designs"},{"name":"Baby Moments","price":0,"description":"Cute baby-themed pages"}]}]}'::jsonb
WHERE name = 'Handmade Scrapbook';

-- 2. CUSTOMISED CARICATURE - Individual ₹900, Couple ₹1100
UPDATE products
SET 
  price = 900,
  customization_charge = 0,
  customization_options = '{"type":"caricature","hasPhotoUpload":true,"options":[{"category":"Type","choices":[{"name":"Individual","price":0,"description":"Single person caricature"},{"name":"Couple","price":200,"description":"Two people caricature"}]},{"category":"Size","choices":[{"name":"22.5 cm × 9 cm","price":0,"width":22.5,"height":9}]}]}'::jsonb
WHERE name = 'Customised Caricature';

-- 3. CUSTOMISED PHOTO MUG - Individual ₹299, Couple ₹499
UPDATE products
SET 
  price = 299,
  customization_charge = 0,
  customization_options = '{"type":"mug","hasPhotoUpload":true,"options":[{"category":"Type","choices":[{"name":"Individual Mug","price":0,"description":"Single mug with one photo"},{"name":"Couple Mugs (Set of 2)","price":200,"description":"Matching pair of mugs"}]}]}'::jsonb
WHERE name = 'Customised Photo Mug';

-- 4. POLAROID PHOTO PRINTS - Set customization_charge to 0
UPDATE products
SET customization_charge = 0
WHERE name = 'Polaroid Photo Prints';

-- 5. CUSTOMISED PHOTO FRAME - Set customization_charge to 0
UPDATE products
SET customization_charge = 0
WHERE name = 'Customised Photo Frame';

-- 6. PHOTO STAND - Set customization_charge to 0
UPDATE products
SET customization_charge = 0
WHERE name = 'Photo Stand';

-- 7. CUSTOMISED CALENDAR - Set customization_charge to 0
UPDATE products
SET customization_charge = 0
WHERE name = 'Customised Calendar';

-- 8. CUSTOMISED WISH CARD - Set customization_charge to 0
UPDATE products
SET customization_charge = 0
WHERE name = 'Customised Wish Card';

-- Verify all updates
SELECT 
  name, 
  price,
  customization_charge,
  customization_options 
FROM products 
WHERE is_customizable = true
ORDER BY name;

