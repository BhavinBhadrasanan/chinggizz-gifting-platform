-- Fix Belt, Wallet, and Sunglasses category assignment
-- The issue: category_id is NULL for Belt and Wallet

-- First, let's check what category IDs exist
SELECT id, name FROM categories ORDER BY name;

-- Update Belt to have the correct category_id
UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1)
WHERE name = 'Belt';

-- Update Wallet to have the correct category_id
UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1)
WHERE name = 'Wallet';

-- Update Sunglasses to have the correct category_id (if it exists)
UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1)
WHERE name = 'Sunglasses';

-- If Sunglasses doesn't exist, create it
INSERT INTO products (
  name, description, price, product_type, image_url, is_customizable, 
  customization_charge, stock_quantity, active, category_id, customization_options,
  width_cm, height_cm, depth_cm, created_at, updated_at
)
SELECT 
  'Sunglasses',
  'Stylish sunglasses with UV protection. Perfect for sunny days.',
  999.00,
  'CUSTOMISED_ITEM',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
  true,
  0.00,
  50,
  true,
  (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1),
  '{
    "type": "sunglasses",
    "options": [
      {
        "category": "Type",
        "choices": [
          {"name": "Men''s Sunglasses", "price": 0, "description": "Classic men''s sunglasses"},
          {"name": "Women''s Sunglasses", "price": 100, "description": "Elegant women''s sunglasses"},
          {"name": "Unisex Sunglasses", "price": 50, "description": "Versatile unisex design"}
        ]
      },
      {
        "category": "Frame Style",
        "choices": [
          {"name": "Aviator", "price": 0, "description": "Classic aviator style"},
          {"name": "Wayfarer", "price": 100, "description": "Trendy wayfarer design"},
          {"name": "Round", "price": 50, "description": "Vintage round frames"},
          {"name": "Cat Eye", "price": 150, "description": "Stylish cat eye frames"}
        ]
      },
      {
        "category": "Lens Color",
        "choices": [
          {"name": "Black", "price": 0},
          {"name": "Brown", "price": 0},
          {"name": "Blue", "price": 50},
          {"name": "Green", "price": 50},
          {"name": "Gradient", "price": 100}
        ]
      }
    ]
  }'::jsonb,
  15.00,
  6.00,
  5.00,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sunglasses');

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

