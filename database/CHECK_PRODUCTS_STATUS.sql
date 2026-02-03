-- Check current status of all products in the database
-- This will help diagnose why Belt, Wallet, and Sunglasses are not showing

-- 1. Check if the products exist
SELECT 
  id,
  name,
  price,
  active,
  is_customizable,
  product_type,
  category_id,
  created_at
FROM products
WHERE name IN ('Watches', 'Watch & Accessories', 'Belt', 'Wallet', 'Sunglasses')
ORDER BY name;

-- 2. Check category information
SELECT 
  c.id as category_id,
  c.name as category_name,
  c.active as category_active,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.name = 'Fashion & Accessories'
GROUP BY c.id, c.name, c.active;

-- 3. Check all active products
SELECT 
  id,
  name,
  price,
  product_type,
  category_id
FROM products
WHERE active = true
ORDER BY name;

