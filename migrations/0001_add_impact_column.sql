-- Phase 1: Add impact column and copy data from gravity
-- This is a SAFE migration that preserves the gravity column as backup

-- Step 1: Add new impact column as nullable
ALTER TABLE tasks ADD COLUMN impact INTEGER;

-- Step 2: Copy all existing data from gravity to impact
UPDATE tasks SET impact = gravity WHERE impact IS NULL;

-- Step 3: Make impact NOT NULL to match schema requirements
ALTER TABLE tasks ALTER COLUMN impact SET NOT NULL;

-- Step 4: Set default value for future inserts
ALTER TABLE tasks ALTER COLUMN impact SET DEFAULT 3;
ALTER TABLE tasks ALTER COLUMN gravity DROP NOT NULL;

-- At this point, both gravity and impact columns exist with identical data
-- The application code will be updated to use impact
-- Gravity column remains as backup for rollback if needed
