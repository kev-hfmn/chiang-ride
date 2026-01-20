import { createAdminClient } from "@/lib/supabase/admin";
import { Review } from "@/lib/types/custom";

export async function getShopReviews(shopId: string): Promise<Review[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data || []) as Review[];
}

export interface ShopRatingStats {
  averageRating: number;
  reviewCount: number;
}

export async function getShopRatingStats(
  shopId: string,
): Promise<ShopRatingStats> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("shop_id", shopId);

  if (error || !data || data.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const totalRating = data.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Math.round((totalRating / data.length) * 10) / 10;

  return {
    averageRating,
    reviewCount: data.length,
  };
}

export async function getAllShopsWithRatings(): Promise<
  Map<string, ShopRatingStats>
> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("shop_id, rating");

  if (error || !data) {
    return new Map();
  }

  // Group ratings by shop
  const shopRatings = new Map<string, number[]>();
  for (const review of data) {
    const ratings = shopRatings.get(review.shop_id) || [];
    ratings.push(review.rating);
    shopRatings.set(review.shop_id, ratings);
  }

  // Calculate stats for each shop
  const result = new Map<string, ShopRatingStats>();
  for (const [shopId, ratings] of shopRatings) {
    const totalRating = ratings.reduce((sum, r) => sum + r, 0);
    const averageRating = Math.round((totalRating / ratings.length) * 10) / 10;
    result.set(shopId, { averageRating, reviewCount: ratings.length });
  }

  return result;
}
