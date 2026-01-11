-- Phase 3: Drop old gravity column
-- IMPORTANT: Only run this AFTER verifying the application works correctly with impact column
-- Recommended: Wait 24-48 hours after deploying code changes before running this

-- Drop the gravity column (impact column is now the source of truth)
ALTER TABLE tasks DROP COLUMN gravity;

-- This migration should only be executed after thorough production testing
-- Ensure all these conditions are met before running:
-- 1. Code has been deployed and uses 'impact' field
-- 2. No errors in production logs for 24-48 hours
-- 3. All features tested: create, read, update, delete, sorting, filtering
-- 4. Score calculation verified: impact × urgency × tendency
-- 5. Backup created before running this migration
