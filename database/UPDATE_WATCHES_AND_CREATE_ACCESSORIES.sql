-- Update "Watch & Accessories" to only include watches
-- Create separate products for Belt, Wallet, and Sunglasses

-- 1. Update existing "Watch & Accessories" product to only include watches
UPDATE products
SET 
  name = 'Watches',
  description = 'Stylish watches for every occasion. Perfect gift for him or her.',
  price = 1499.00,
  customization_charge = 0.00,
  customization_options = '{
    "type": "watch",
    "options": [
      {
        "category": "Type",
        "choices": [
          {"name": "Men''s Watch", "price": 0, "description": "Classic men''s wristwatch"},
          {"name": "Women''s Watch", "price": 200, "description": "Elegant women''s watch"},
          {"name": "Couple Watches", "price": 1000, "description": "Matching pair of watches"}
        ]
      },
      {
        "category": "Style",
        "choices": [
          {"name": "Classic", "price": 0, "description": "Timeless design"},
          {"name": "Modern", "price": 200, "description": "Contemporary style"},
          {"name": "Sport", "price": 100, "description": "Athletic design"},
          {"name": "Luxury", "price": 500, "description": "Premium luxury finish"}
        ]
      }
    ]
  }'::jsonb
WHERE name = 'Watch & Accessories';

-- 2. Insert Belt product (if it doesn''t exist)
INSERT INTO products (
  name, description, price, product_type, image_url, is_customizable, 
  customization_charge, stock_quantity, active, category_id, customization_options,
  width_cm, height_cm, depth_cm, created_at, updated_at
)
SELECT 
  'Belt',
  'Premium leather belts for men and women. Stylish and durable.',
  699.00,
  'CUSTOMISED_ITEM',
  'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=500',
  true,
  0.00,
  50,
  true,
  (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1),
  '{
    "type": "belt",
    "options": [
      {
        "category": "Type",
        "choices": [
          {"name": "Men''s Belt", "price": 0, "description": "Classic men''s leather belt"},
          {"name": "Women''s Belt", "price": 100, "description": "Elegant women''s belt"}
        ]
      },
      {
        "category": "Material",
        "choices": [
          {"name": "Genuine Leather", "price": 0, "description": "Premium leather"},
          {"name": "Synthetic Leather", "price": -200, "description": "Durable synthetic material"},
          {"name": "Canvas", "price": -300, "description": "Casual canvas belt"}
        ]
      },
      {
        "category": "Color",
        "choices": [
          {"name": "Black", "price": 0},
          {"name": "Brown", "price": 0},
          {"name": "Tan", "price": 0},
          {"name": "Navy Blue", "price": 50}
        ]
      }
    ]
  }'::jsonb,
  10.00,
  5.00,
  2.00,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Belt');

-- 3. Insert Wallet product (if it doesn''t exist)
INSERT INTO products (
  name, description, price, product_type, image_url, is_customizable, 
  customization_charge, stock_quantity, active, category_id, customization_options,
  width_cm, height_cm, depth_cm, created_at, updated_at
)
SELECT 
  'Wallet',
  'Premium leather wallets with multiple card slots. Perfect for daily use.',
  799.00,
  'CUSTOMISED_ITEM',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
  true,
  0.00,
  50,
  true,
  (SELECT id FROM categories WHERE name = 'Fashion & Accessories' LIMIT 1),
  '{
    "type": "wallet",
    "options": [
      {
        "category": "Type",
        "choices": [
          {"name": "Men''s Wallet", "price": 0, "description": "Classic bifold wallet"},
          {"name": "Women''s Wallet", "price": 100, "description": "Elegant clutch wallet"},
          {"name": "Card Holder", "price": -200, "description": "Slim card holder"}
        ]
      },
      {
        "category": "Material",
        "choices": [
          {"name": "Genuine Leather", "price": 0, "description": "Premium leather"},
          {"name": "Synthetic Leather", "price": -200, "description": "Durable synthetic material"},
          {"name": "Canvas", "price": -300, "description": "Casual canvas wallet"}
        ]
      },
      {
        "category": "Color",
        "choices": [
          {"name": "Black", "price": 0},
          {"name": "Brown", "price": 0},
          {"name": "Tan", "price": 0},
          {"name": "Navy Blue", "price": 50},
          {"name": "Red", "price": 50}
        ]
      }
    ]
  }'::jsonb,
  12.00,
  9.00,
  2.00,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wallet');

-- 4. Insert Sunglasses product (if it doesn't exist)
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

-- Verify all products
SELECT
  id,
  name,
  price,
  description,
  customization_options
FROM products
WHERE name IN ('Watches', 'Belt', 'Wallet', 'Sunglasses')
ORDER BY name;
