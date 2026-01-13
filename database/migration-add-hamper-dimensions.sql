-- Migration Script: Add Physical Dimensions to Hamper Boxes
-- Adds lengthCm, widthCm, heightCm columns for 3D validation
-- Date: 2024-01-12

-- Add new columns to hamper_boxes table
ALTER TABLE hamper_boxes 
ADD COLUMN IF NOT EXISTS length_cm DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS width_cm DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS height_cm DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS grid_rows INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS grid_cols INTEGER DEFAULT 3;

-- Add comments for documentation
COMMENT ON COLUMN hamper_boxes.length_cm IS 'Box length in centimeters (X-axis in 3D)';
COMMENT ON COLUMN hamper_boxes.width_cm IS 'Box width in centimeters (Z-axis in 3D)';
COMMENT ON COLUMN hamper_boxes.height_cm IS 'Box height in centimeters (Y-axis in 3D)';
COMMENT ON COLUMN hamper_boxes.grid_rows IS 'Number of rows in the placement grid';
COMMENT ON COLUMN hamper_boxes.grid_cols IS 'Number of columns in the placement grid';

-- Update existing hamper boxes with standard dimensions based on size
-- Small: 20 × 15 × 8 cm (6 items: 2 rows × 3 cols)
UPDATE hamper_boxes 
SET length_cm = 20.00, 
    width_cm = 15.00, 
    height_cm = 8.00,
    grid_rows = 2,
    grid_cols = 3
WHERE size = 'SMALL' AND length_cm IS NULL;

-- Medium: 30 × 20 × 10 cm (9 items: 3 rows × 3 cols)
UPDATE hamper_boxes 
SET length_cm = 30.00, 
    width_cm = 20.00, 
    height_cm = 10.00,
    grid_rows = 3,
    grid_cols = 3
WHERE size = 'MEDIUM' AND length_cm IS NULL;

-- Large: 40 × 30 × 12 cm (12 items: 3 rows × 4 cols)
UPDATE hamper_boxes 
SET length_cm = 40.00, 
    width_cm = 30.00, 
    height_cm = 12.00,
    grid_rows = 3,
    grid_cols = 4
WHERE size = 'LARGE' AND length_cm IS NULL;

-- Extra Large: 50 × 35 × 15 cm (16 items: 4 rows × 4 cols)
UPDATE hamper_boxes 
SET length_cm = 50.00, 
    width_cm = 35.00, 
    height_cm = 15.00,
    grid_rows = 4,
    grid_cols = 4
WHERE size = 'EXTRA_LARGE' AND length_cm IS NULL;

-- Create index for faster dimension-based queries
CREATE INDEX IF NOT EXISTS idx_hamper_boxes_dimensions ON hamper_boxes(length_cm, width_cm, height_cm);

-- Verify migration
SELECT 
    id,
    name,
    size,
    length_cm,
    width_cm,
    height_cm,
    grid_rows,
    grid_cols,
    max_items
FROM hamper_boxes
ORDER BY 
    CASE size
        WHEN 'SMALL' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LARGE' THEN 3
        WHEN 'EXTRA_LARGE' THEN 4
        ELSE 5
    END;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📦 Added physical dimensions to all hamper boxes';
    RAISE NOTICE '📏 Dimensions: length_cm, width_cm, height_cm';
    RAISE NOTICE '🎯 Grid configuration: grid_rows, grid_cols';
END $$;

