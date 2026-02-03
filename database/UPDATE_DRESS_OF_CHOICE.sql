-- Update "Dress of Choice" product to remove pricing and show "Price on Request" message
-- This script updates the product to have:
-- 1. Price set to 0.00
-- 2. priceOnRequest flag set to true in customization_options
-- 3. Custom message: "We will purchase it for you and share the details"
-- 4. Category options: Men, Women, Boy, Girl, Infant
-- 5. All option prices set to 0

UPDATE products
SET
  price = 0.00,
  description = 'Beautiful dresses for special occasions. Choose style, size, and color. We will purchase it for you and share the details.',
  customization_options = '{
    "type": "dress",
    "priceOnRequest": true,
    "priceMessage": "We will purchase it for you and share the details",
    "options": [
      {
        "category": "Category",
        "choices": [
          {"name": "Men", "price": 0, "description": "Men''s clothing"},
          {"name": "Women", "price": 0, "description": "Women''s clothing"},
          {"name": "Boy", "price": 0, "description": "Boys'' clothing"},
          {"name": "Girl", "price": 0, "description": "Girls'' clothing"},
          {"name": "Infant", "price": 0, "description": "Infant clothing"}
        ]
      },
      {
        "category": "Type",
        "choices": [
          {"name": "Casual Dress", "price": 0, "description": "Comfortable everyday wear"},
          {"name": "Party Dress", "price": 0, "description": "Glamorous party outfit"},
          {"name": "Formal Dress", "price": 0, "description": "Elegant formal attire"},
          {"name": "Traditional Dress", "price": 0, "description": "Cultural traditional wear"}
        ]
      },
      {
        "category": "Size",
        "choices": [
          {"name": "XS", "price": 0},
          {"name": "S", "price": 0},
          {"name": "M", "price": 0},
          {"name": "L", "price": 0},
          {"name": "XL", "price": 0},
          {"name": "XXL", "price": 0}
        ]
      },
      {
        "category": "Color",
        "choices": [
          {"name": "Red", "price": 0},
          {"name": "Blue", "price": 0},
          {"name": "Black", "price": 0},
          {"name": "White", "price": 0},
          {"name": "Pink", "price": 0},
          {"name": "Green", "price": 0},
          {"name": "Yellow", "price": 0},
          {"name": "Multi-Color", "price": 0}
        ]
      }
    ]
  }'::jsonb
WHERE name = 'Dress of Choice';

-- Verify the update
SELECT 
  id,
  name,
  price,
  description,
  customization_options
FROM products
WHERE name = 'Dress of Choice';

