import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, ShieldCheck, Store } from "lucide-react";
import ShopMapWrapper from "@/components/shop-map-wrapper";
import { getAllShopsWithRatings } from "@/lib/db/reviews";
import { RatingBadge } from "@/components/review-card";
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getTranslations } from "@/lib/i18n/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export default async function ShopsPage() {
  const supabase = await createClient();
  const { t } = await getTranslations();

  const [{ data: shops }, ratingsMap] = await Promise.all([
    supabase
      .from("shops")
      .select("*")
      .order("is_verified", { ascending: false })
      .order("created_at", { ascending: false }),
    getAllShopsWithRatings(),
  ]);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t('exploreShops')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t('findTrustedRentals')}
        </p>
      </div>

      {/* Map */}
      {shops && shops.length > 0 && (
        <ShopMapWrapper
          shops={shops.map((shop) => ({
            ...shop,
            latitude: shop.location_lat,
            longitude: shop.location_lng,
          }))}
        />
      )}

      {/* Shop List - Airbnb style grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
        {shops?.map((shop) => {
          const ratingStats = ratingsMap.get(shop.id);
          return (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="block group"
            >
              {/* Image container */}
              <div className="aspect-4/3 bg-gray-100 rounded-2xl relative overflow-hidden">
                {shop.image_url ? (
                  <OptimizedImage
                    src={shop.image_url}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                    <Store className="w-12 h-12 text-green-300" />
                  </div>
                )}

                {shop.is_verified && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-green-700 shadow-sm"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {t('verified')}
                  </Badge>
                )}
              </div>

              {/* Content below image */}
              <div className="pt-2.5 space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {shop.name}
                  </h3>
                  {ratingStats && (
                    <RatingBadge
                      averageRating={ratingStats.averageRating}
                      reviewCount={ratingStats.reviewCount}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{shop.address || shop.city}</span>
                </p>
                <p className="text-xs text-gray-500 line-clamp-1 pt-0.5">
                  {shop.description || t('reliableScooterRentals')}
                </p>
              </div>
            </Link>
          );
        })}

        {(!shops || shops.length === 0) && (
          <div className="col-span-full">
            <Card className="py-16 text-center border-dashed border-2 border-gray-200 shadow-none">
              <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('noShopsFound')}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {t('beFirstToList')}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
