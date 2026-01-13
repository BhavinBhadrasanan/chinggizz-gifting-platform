-- Migration Script: Order Enhancements
-- Adds delivery method, order type, and address fields to orders table
-- Date: 2024-01-12

-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50) DEFAULT 'DIRECT_DELIVERY',
ADD COLUMN IF NOT EXISTS order_type VARCHAR(50) DEFAULT 'DIRECT_PURCHASE',
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN orders.delivery_method IS 'Delivery method: DIRECT_DELIVERY or COURIER_DELIVERY';
COMMENT ON COLUMN orders.order_type IS 'Order type: DIRECT_PURCHASE or HAMPER_ARRANGEMENT';
COMMENT ON COLUMN orders.city IS 'Customer city for delivery';
COMMENT ON COLUMN orders.state IS 'Customer state for delivery';
COMMENT ON COLUMN orders.pincode IS 'Customer pincode for delivery';

-- Create index for faster filtering by delivery method and order type
CREATE INDEX IF NOT EXISTS idx_orders_delivery_method ON orders(delivery_method);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);

-- Update existing orders with default values (if any exist)
UPDATE orders 
SET delivery_method = 'DIRECT_DELIVERY', 
    order_type = 'DIRECT_PURCHASE'
WHERE delivery_method IS NULL OR order_type IS NULL;

-- Verify migration
SELECT 
    column_name, 
    data_type, 
    character_maximum_length, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('delivery_method', 'order_type', 'city', 'state', 'pincode')
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Added columns: delivery_method, order_type, city, state, pincode';
END $$;

