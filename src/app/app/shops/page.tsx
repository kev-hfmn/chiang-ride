import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, ShieldCheck, Store, Filter } from "lucide-react";
import ShopMapWrapper from "@/components/shop-map-wrapper";
import { getAllShopsWithRatings } from "@/lib/db/reviews";
import { RatingBadge } from "@/components/review-card";
import { getTranslations } from "@/lib/i18n/server";
import { LanguageToggle } from "@/components/language-toggle";

export const revalidate = 0;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('exploreShops')}
          </h1>
          <p className="text-gray-500 text-sm">
            {t('findTrustedRentals')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            {t('filters')}
          </button>
        </div>
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

      {/* Shop List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops?.map((shop) => {
          const ratingStats = ratingsMap.get(shop.id);
          return (
            <Link
              key={shop.id}
              href={`/app/shops/${shop.id}`}
              className="block group bg-white border-none rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden ring-1 ring-gray-100"
            >
              <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-300 group-hover:from-green-100 group-hover:to-green-200 transition-colors relative">
                <Store className="w-16 h-16 opacity-50" />
                {shop.is_verified && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 fill-green-700 text-white" />
                    {t('verified')}
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                      {shop.name}
                    </h3>
                    {ratingStats && (
                      <RatingBadge
                        averageRating={ratingStats.averageRating}
                        reviewCount={ratingStats.reviewCount}
                      />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {shop.address || shop.city}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {shop.description || t('reliableScooterRentals')}
                </p>
              </div>
            </Link>
          );
        })}

        {(!shops || shops.length === 0) && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('noShopsFound')}
            </h3>
            <p className="text-gray-500">
              {t('beFirstToList')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
