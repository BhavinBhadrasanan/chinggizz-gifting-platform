-- Sample Data for Chinggizz PostgreSQL Database
-- Run this after schema-postgres.sql

-- Insert Categories
INSERT INTO categories (name, description, image_url, display_order, active) VALUES
('Customised Mugs', 'Personalised mugs with custom designs and messages', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d', 1, true),
('Scented Candles', 'Aromatic candles for relaxation and ambiance', 'https://images.unsplash.com/photo-1602874801006-e24a9e2f0f19', 2, true),
('Chocolates & Sweets', 'Premium chocolates and sweet treats', 'https://images.unsplash.com/photo-1511381939415-e44015466834', 3, true),
('Cakes & Desserts', 'Delicious cakes and desserts for celebrations', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', 4, true),
('Accessories', 'Keychains, photo frames, and other accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93', 5, true)
ON CONFLICT (name) DO NOTHING;

-- Insert Products
INSERT INTO products (name, description, price, product_type, image_url, is_customizable, customization_charge, stock_quantity, active, category_id, width_cm, height_cm, depth_cm, weight_grams) VALUES
-- Mugs
('Classic White Mug', 'Classic white ceramic mug perfect for customization', 299.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d', true, 100.00, 50, true, 1, 8.0, 9.5, 8.0, 350.0),
('Magic Mug', 'Color-changing mug that reveals design when hot', 499.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1517256673644-36ad11246d21', true, 150.00, 30, true, 1, 8.0, 9.5, 8.0, 350.0),
('Couple Mugs Set', 'Set of 2 matching mugs for couples', 699.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261', true, 200.00, 25, true, 1, 16.0, 9.5, 8.0, 700.0),

-- Candles
('Lavender Scented Candle', 'Relaxing lavender scented candle in glass jar', 399.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1602874801006-e24a9e2f0f19', false, 0.00, 40, true, 2, 7.5, 10.0, 7.5, 300.0),
('Vanilla Bean Candle', 'Sweet vanilla scented candle', 399.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1603006905003-be475563bc59', false, 0.00, 40, true, 2, 7.5, 10.0, 7.5, 300.0),
('Rose Garden Candle', 'Romantic rose scented candle', 449.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1615485500834-bc10199bc727', false, 0.00, 35, true, 2, 7.5, 10.0, 7.5, 300.0),

-- Chocolates
('Ferrero Rocher Box', 'Premium chocolate gift box (16 pieces)', 599.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1511381939415-e44015466834', false, 0.00, 60, true, 3, 15.0, 5.0, 15.0, 200.0),
('Dairy Milk Silk', 'Smooth and creamy chocolate bar', 199.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1606312619070-d48b4cda8bf6', false, 0.00, 100, true, 3, 10.0, 2.0, 15.0, 150.0),
('Handmade Chocolate Box', 'Artisan handmade chocolates (12 pieces)', 799.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1548907040-4baa42d10919', false, 0.00, 30, true, 3, 20.0, 5.0, 15.0, 250.0),

-- Cakes
('Red Velvet Cake', 'Classic red velvet cake with cream cheese frosting (1kg)', 899.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', true, 200.00, 20, true, 4, 20.0, 10.0, 20.0, 1000.0),
('Chocolate Truffle Cake', 'Rich chocolate truffle cake (1kg)', 799.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62', true, 200.00, 20, true, 4, 20.0, 10.0, 20.0, 1000.0),
('Black Forest Cake', 'Classic black forest with cherries (1kg)', 849.00, 'EDIBLE_ITEM', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c', true, 200.00, 20, true, 4, 20.0, 10.0, 20.0, 1000.0),

-- Accessories
('Photo Keychain', 'Customised photo keychain', 149.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93', true, 50.00, 100, true, 5, 5.0, 0.5, 3.0, 20.0),
('Wooden Photo Frame', 'Elegant wooden photo frame (6x8 inch)', 399.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca', true, 100.00, 40, true, 5, 20.0, 25.0, 2.0, 300.0),
('Personalized Cushion', 'Custom printed cushion with photo', 599.00, 'CUSTOMISED_ITEM', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2', true, 150.00, 30, true, 5, 40.0, 40.0, 10.0, 400.0)
ON CONFLICT DO NOTHING;

-- Insert Hamper Boxes with Physical Dimensions
INSERT INTO hamper_boxes (name, description, size, price, max_items, image_url, active, length_cm, width_cm, height_cm, grid_rows, grid_cols) VALUES
('Small Gift Box', 'Perfect for 3-4 small items', 'SMALL', 199.00, 6, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48', true, 20.00, 15.00, 8.00, 2, 3),
('Medium Gift Box', 'Ideal for 5-6 medium items', 'MEDIUM', 299.00, 9, 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a', true, 30.00, 20.00, 10.00, 3, 3),
('Large Gift Box', 'Spacious box for 7-9 items', 'LARGE', 399.00, 12, 'https://images.unsplash.com/photo-1606914469633-5b5f1e3e3c04', true, 40.00, 30.00, 12.00, 3, 4),
('Extra Large Box', 'Premium large box for 10+ items', 'EXTRA_LARGE', 599.00, 16, 'https://images.unsplash.com/photo-1607344645866-009c320b63e0', true, 50.00, 35.00, 15.00, 4, 4)
ON CONFLICT DO NOTHING;

-- Note: Admin user will be created automatically by DataInitializer.java
-- Default credentials: username=admin, password=admin123

-- Sample Order (Optional - for testing)
INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, delivery_address, delivery_date, delivery_time_slot, total_amount, status, payment_status, payment_method) VALUES
('ORD-20240101-001', 'John Doe', '9876543210', 'john@example.com', '123 Main Street, Bangalore, Karnataka - 560001', '2024-02-14', 'MORNING', 2499.00, 'NEW', 'PENDING', 'COD')
ON CONFLICT (order_number) DO NOTHING;

-- Get the order ID for inserting order items
DO $$
DECLARE
    v_order_id BIGINT;
    v_product_id BIGINT;
    v_hamper_box_id BIGINT;
BEGIN
    -- Get order ID
    SELECT id INTO v_order_id FROM orders WHERE order_number = 'ORD-20240101-001';
    
    IF v_order_id IS NOT NULL THEN
        -- Insert order item
        SELECT id INTO v_product_id FROM products WHERE name = 'Classic White Mug' LIMIT 1;
        IF v_product_id IS NOT NULL THEN
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
            VALUES (v_order_id, v_product_id, 1, 399.00, 399.00)
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Insert order hamper
        SELECT id INTO v_hamper_box_id FROM hamper_boxes WHERE size = 'MEDIUM' LIMIT 1;
        IF v_hamper_box_id IS NOT NULL THEN
            INSERT INTO order_hampers (order_id, hamper_box_id, hamper_box_price, items_total, total_price, with_arrangement, arrangement_charge, hamper_data)
            VALUES (v_order_id, v_hamper_box_id, 299.00, 1800.00, 2099.00, true, 0.00, '{"items": [{"productId": 1, "quantity": 1, "position": 0}]}')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Verify data
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Hamper Boxes', COUNT(*) FROM hamper_boxes
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Order Hampers', COUNT(*) FROM order_hampers;

