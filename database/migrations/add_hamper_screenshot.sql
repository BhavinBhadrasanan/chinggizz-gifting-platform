-- Migration: Add screenshot field to order_hampers table
-- This allows storing the 3D hamper arrangement screenshot for admin reference

ALTER TABLE order_hampers 
ADD COLUMN IF NOT EXISTS screenshot TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN order_hampers.screenshot IS 'Base64 encoded screenshot of the 3D hamper arrangement for admin reference';

-- Also add hamper_name field for custom naming
ALTER TABLE order_hampers 
ADD COLUMN IF NOT EXISTS hamper_name VARCHAR(200);

COMMENT ON COLUMN order_hampers.hamper_name IS 'Custom name given by customer to the hamper';

