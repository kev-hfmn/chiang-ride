-- Migration: Add SQL functions for efficient rating aggregation
-- Created: 2026-01-21
-- Purpose: Replace in-memory rating calculations with SQL aggregation

-- Function to get rating stats for a single shop
CREATE OR REPLACE FUNCTION get_shop_rating_stats(shop_id_param UUID)
RETURNS TABLE (
  avg_rating NUMERIC,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    AVG(rating)::NUMERIC AS avg_rating,
    COUNT(*)::BIGINT AS review_count
  FROM reviews
  WHERE shop_id = shop_id_param;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get rating stats for all shops
CREATE OR REPLACE FUNCTION get_all_shop_ratings()
RETURNS TABLE (
  shop_id UUID,
  avg_rating NUMERIC,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.shop_id,
    AVG(r.rating)::NUMERIC AS avg_rating,
    COUNT(*)::BIGINT AS review_count
  FROM reviews r
  GROUP BY r.shop_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_shop_rating_stats(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_all_shop_ratings() TO authenticated, anon;
