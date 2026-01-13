-- Migration Script for Concurrency and Scalability Fixes
-- Run this script on your Supabase database

-- 1. Add index on order_number for faster uniqueness checks
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- 2. Add index on product stock_quantity for faster stock checks
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity) WHERE stock_quantity IS NOT NULL;

-- 3. Add index on product active status for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- 4. Add composite index for product queries
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, active);
CREATE INDEX IF NOT EXISTS idx_products_type_active ON products(product_type, active);

-- 5. Add index on order creation timestamp for faster sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 6. Add index on order status for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 7. Ensure order_number has unique constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS unique_order_number;
ALTER TABLE orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);

-- 8. Add check constraint for stock quantity (must be non-negative)
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_stock_non_negative;
ALTER TABLE products ADD CONSTRAINT check_stock_non_negative CHECK (stock_quantity IS NULL OR stock_quantity >= 0);

-- 9. Create function to update stock atomically (optional - for future use)
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

-- 10. Add comments for documentation
COMMENT ON INDEX idx_orders_order_number IS 'Index for fast order number uniqueness checks';
COMMENT ON INDEX idx_products_stock_quantity IS 'Index for fast stock availability checks';
COMMENT ON INDEX idx_products_active IS 'Index for filtering active products';
COMMENT ON INDEX idx_orders_created_at IS 'Index for sorting orders by creation date';

-- 11. Analyze tables for query optimization
ANALYZE products;
ANALYZE orders;
ANALYZE categories;
ANALYZE hamper_boxes;

-- Migration completed successfully
SELECT 'Migration completed successfully!' AS status;

