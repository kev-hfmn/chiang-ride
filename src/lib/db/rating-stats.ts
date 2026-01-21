import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/utils/logger';

export interface ShopRatingStats {
  averageRating: number;
  reviewCount: number;
}

/**
 * Get rating statistics for a single shop using SQL aggregation
 * More efficient than fetching all reviews and calculating in JS
 */
export async function getShopRatingStats(
  shopId: string,
): Promise<ShopRatingStats> {
  const supabase = createAdminClient();

  // Use SQL aggregation instead of fetching all reviews
  const { data, error } = await supabase
    .rpc('get_shop_rating_stats', { shop_id_param: shopId });

  if (error) {
    logger.error('Failed to fetch rating stats', error, { shopId });
    return { averageRating: 0, reviewCount: 0 };
  }

  if (!data || data.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const stats = data[0];
  return {
    averageRating: Math.round((stats.avg_rating || 0) * 10) / 10,
    reviewCount: stats.review_count || 0,
  };
}

/**
 * Get rating statistics for all shops in a single query
 * Returns a Map for O(1) lookup by shop_id
 */
export async function getAllShopsWithRatings(): Promise<
  Map<string, ShopRatingStats>
> {
  const supabase = createAdminClient();

  // Use SQL GROUP BY aggregation
  const { data, error } = await supabase
    .rpc('get_all_shop_ratings');

  if (error || !data) {
    logger.error('Failed to fetch all shop ratings', error);
    return new Map();
  }

  const result = new Map<string, ShopRatingStats>();
  for (const row of data) {
    result.set(row.shop_id, {
      averageRating: Math.round((row.avg_rating || 0) * 10) / 10,
      reviewCount: row.review_count || 0,
    });
  }

  return result;
}
