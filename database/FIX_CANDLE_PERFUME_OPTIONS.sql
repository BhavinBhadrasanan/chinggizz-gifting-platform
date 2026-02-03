-- ========================================
-- FIX SCENTED CANDLES AND PERFUMES CUSTOMIZATION OPTIONS
-- ========================================
-- Issue: Missing "category" wrapper and "choices" array in customization_options
-- This causes "TypeError: can't access property 'age', option.choices is undefined"
-- ========================================

-- 1. FIX SCENTED CANDLES - Add proper category structure
UPDATE products
SET 
  customization_options = '{
    "type": "candle",
    "options": [
      {
        "category": "Fragrance",
        "choices": [
          {"name": "Lavender", "price": 0, "description": "Calming lavender scent"},
          {"name": "Vanilla Rose", "price": 50, "description": "Sweet vanilla with rose notes"},
          {"name": "Sandalwood", "price": 100, "description": "Traditional sandalwood fragrance"},
          {"name": "Jasmine", "price": 50, "description": "Fresh jasmine aroma"},
          {"name": "Citrus Fresh", "price": 0, "description": "Energizing citrus blend"},
          {"name": "Apple", "price": 0, "description": "Fresh apple fragrance"}
        ]
      }
    ]
  }'::jsonb
WHERE name = 'Scented Candles';

-- 2. FIX PREMIUM PERFUMES - Add proper category structure
UPDATE products
SET 
  customization_options = '{
    "type": "perfume",
    "options": [
      {
        "category": "Fragrance",
        "choices": [
          {"name": "Floral Essence", "price": 0, "description": "Delicate floral notes"},
          {"name": "Woody Musk", "price": 200, "description": "Sophisticated woody fragrance"},
          {"name": "Citrus Fresh", "price": 0, "description": "Refreshing citrus blend"},
          {"name": "Oriental Spice", "price": 150, "description": "Exotic spicy notes"},
          {"name": "Ocean Breeze", "price": 100, "description": "Fresh aquatic scent"}
        ]
      }
    ]
  }'::jsonb
WHERE name = 'Premium Perfumes';

-- Verify the updates
SELECT 
  name, 
  price,
  customization_charge,
  customization_options
FROM products 
WHERE name IN ('Scented Candles', 'Premium Perfumes');

