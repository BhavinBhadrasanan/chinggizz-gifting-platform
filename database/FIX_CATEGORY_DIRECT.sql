-- Direct fix using the category_id from Watches product
-- Since Watches (ID: 13) has category_id = 3, we'll use that

-- Update Belt to use category_id = 3 (same as Watches)
UPDATE products
SET category_id = 3
WHERE name = 'Belt';

-- Update Wallet to use category_id = 3 (same as Watches)
UPDATE products
SET category_id = 3
WHERE name = 'Wallet';

-- Update Sunglasses to use category_id = 3 (same as Watches)
UPDATE products
SET category_id = 3
WHERE name = 'Sunglasses';

-- Verify the fix
SELECT 
  id,
  name,
  price,
  active,
  category_id,
  (SELECT name FROM categories WHERE id = products.category_id) as category_name
FROM products
WHERE name IN ('Watches', 'Belt', 'Wallet', 'Sunglasses')
ORDER BY name;

