-- Concurrency and Scalability Fixes


CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity) WHERE stock_quantity IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, active);
CREATE INDEX IF NOT EXISTS idx_products_type_active ON products(product_type, active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
ALTER TABLE orders DROP CONSTRAINT IF EXISTS unique_order_number;
ALTER TABLE orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_stock_non_negative;
ALTER TABLE products ADD CONSTRAINT check_stock_non_negative CHECK (stock_quantity IS NULL OR stock_quantity >= 0);
CREATE OR REPLACE FUNCTION decrement_product_stock(
    p_product_id BIGINT,
    p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_stock INTEGER;
BEGIN
    -- Lock the row for update
    SELECT stock_quantity INTO v_current_stock
    FROM products
    WHERE id = p_product_id
    FOR UPDATE;
    
    -- Check if stock is sufficient
    IF v_current_stock IS NULL OR v_current_stock >= p_quantity THEN
        -- Update stock
        UPDATE products
        SET stock_quantity = CASE 
            WHEN stock_quantity IS NULL THEN NULL
            ELSE stock_quantity - p_quantity
        END
        WHERE id = p_product_id;
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

ANALYZE products;
ANALYZE orders;
ANALYZE categories;
ANALYZE hamper_boxes;

SELECT 'Migration completed successfully!' AS status;

