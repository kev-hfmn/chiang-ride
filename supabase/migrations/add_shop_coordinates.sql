-- Add latitude and longitude columns to shops table
ALTER TABLE shops ADD COLUMN IF NOT EXISTS latitude decimal(10, 8);
ALTER TABLE shops ADD COLUMN IF NOT EXISTS longitude decimal(11, 8);

-- Update existing demo shop with coordinates (if exists)
UPDATE shops SET latitude = 18.7961, longitude = 98.9687 WHERE name = 'Chiang Mai Scooters' AND latitude IS NULL;
