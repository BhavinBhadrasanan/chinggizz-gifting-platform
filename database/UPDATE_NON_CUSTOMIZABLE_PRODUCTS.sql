-- Update products to be non-customizable with "Price on Request"
-- Products: Dress of Choice, Sunglasses, Belt, Jewellery Items, Premium Perfumes, Premium Chocolates, Mini Indoor Plants, Live Outdoor Plants, Watches

-- 1. Update Dress of Choice
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Beautiful dresses for special occasions. Choose style, size, and color. We will purchase it for you and share the details.'
WHERE name = 'Dress of Choice';

-- 2. Update Sunglasses
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Stylish sunglasses with UV protection. We will purchase it for you and share the details.'
WHERE name = 'Sunglasses';

-- 3. Update Belt
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Premium leather belts for men and women. We will purchase it for you and share the details.'
WHERE name = 'Belt';

-- 4. Update Jewellery Items
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = '{"type":"jewellery","priceOnRequest":true,"priceMessage":"We will purchase it for you and share the details","options":[{"category":"Type","choices":[{"name":"Necklace","price":0,"description":"Elegant necklace"},{"name":"Bracelet","price":0,"description":"Stylish bracelet"},{"name":"Earrings","price":0,"description":"Beautiful earrings"},{"name":"Ring","price":0,"description":"Stunning ring"},{"name":"Jewellery Set","price":0,"description":"Complete matching set"}]},{"category":"Material","choices":[{"name":"Silver Plated","price":0,"description":"Elegant silver finish"},{"name":"Gold Plated","price":0,"description":"Luxurious gold finish"},{"name":"Rose Gold","price":0,"description":"Trendy rose gold"}]}]}',
  description = 'Beautiful jewellery pieces for every occasion. We will purchase it for you and share the details.'
WHERE name = 'Jewellery Items';

-- 5. Update Premium Perfumes
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = '{"type":"perfume","priceOnRequest":true,"priceMessage":"We will purchase it for you and share the details","options":[{"category":"Type","choices":[{"name":"Men''s Perfume","price":0,"description":"Premium fragrance for men"},{"name":"Women''s Perfume","price":0,"description":"Elegant fragrance for women"},{"name":"Couple Perfume","price":0,"description":"Matching pair of perfumes"}]}]}',
  description = 'Long-lasting premium fragrances. We will purchase it for you and share the details.'
WHERE name = 'Premium Perfumes';

-- 6. Update Premium Chocolates
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Delicious handcrafted chocolates. We will purchase it for you and share the details.'
WHERE name = 'Premium Chocolates';

-- 7. Update Mini Indoor Plants
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Low-maintenance mini plants in decorative pots. We will purchase it for you and share the details.'
WHERE name = 'Mini Indoor Plants';

-- 8. Update Live Outdoor Plants
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = (customization_options::jsonb || '{"priceOnRequest": true, "priceMessage": "We will purchase it for you and share the details"}'::jsonb)::text,
  description = 'Beautiful flowering plants for balcony or garden. We will purchase it for you and share the details.'
WHERE name = 'Live Outdoor Plants';

-- 9. Update Watches
UPDATE products
SET
  price = 0.00,
  is_customizable = false,
  customization_charge = 0.00,
  customization_options = '{"type":"watch","priceOnRequest":true,"priceMessage":"We will purchase it for you and share the details","options":[{"category":"Type","choices":[{"name":"Men''s Watch","price":0,"description":"Classic men''s wristwatch"},{"name":"Women''s Watch","price":0,"description":"Elegant women''s watch"},{"name":"Couple Watches","price":0,"description":"Matching pair of watches"}]},{"category":"Style","choices":[{"name":"Digital","price":0,"description":"Modern digital display"},{"name":"Analogue","price":0,"description":"Classic analogue with hands"},{"name":"Smartwatch","price":0,"description":"Smart features with fitness tracking"}]}]}',
  description = 'Premium watches for men and women. We will purchase it for you and share the details.'
WHERE name = 'Watches';

-- Verify all updates
SELECT
  id,
  name,
  price,
  is_customizable,
  customization_charge,
  (customization_options::jsonb) ->> 'priceOnRequest' as price_on_request,
  (customization_options::jsonb) ->> 'priceMessage' as price_message
FROM products
WHERE name IN (
  'Dress of Choice',
  'Sunglasses',
  'Belt',
  'Jewellery Items',
  'Premium Perfumes',
  'Premium Chocolates',
  'Mini Indoor Plants',
  'Live Outdoor Plants',
  'Watches'
)
ORDER BY name;

