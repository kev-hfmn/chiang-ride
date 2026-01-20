import { createClient } from "@/lib/supabase/client";
import { getShop, getScooters, getScooterAvailability } from "@/lib/db/shops";
import { getShopReviews, getShopRatingStats } from "@/lib/db/reviews";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Star } from "lucide-react";
import { AvailabilityGrid } from "@/components/availability-grid";
import BookingForm from "@/components/booking-form";
import { ScooterImage } from "@/components/scooter-image";
import { ReviewCard, RatingSummary } from "@/components/review-card";
import { getTranslations } from "@/lib/i18n/server";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getTranslations();

  const [shop, scootersData, reviews, ratingStats] = await Promise.all([
    getShop(id),
    getScooters(id),
    getShopReviews(id),
    getShopRatingStats(id),
  ]);

  const scooters = await Promise.all(
    (scootersData || []).map(async (scooter: any) => {
      const availability = await getScooterAvailability(scooter.id);
      return { ...scooter, availability };
    }),
  );

  if (!shop) return <div>Shop not found</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <Link
          href="/app/shops"
          className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToExplore')}
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                {shop.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {shop.address || t('chiangMaiThailand')}
                </div>
                {ratingStats.reviewCount > 0 && (
                  <RatingSummary
                    averageRating={ratingStats.averageRating}
                    reviewCount={ratingStats.reviewCount}
                  />
                )}
              </div>
            </div>
            <div className="bg-orange-50 text-orange-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {t('verifiedPartner')}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed font-medium">
            {shop.description || t('defaultShopDescription')}
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 flex gap-3 text-sm text-gray-600">
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <span className="font-bold text-gray-900 block mb-1">
                {t('depositPolicy')}
              </span>
              {shop.deposit_policy_text || t('defaultDepositPolicy')}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900">
          {t('availableBikes')}
        </h2>
        <div className="grid gap-6">
          {scooters?.map((scooter) => (
            <div
              key={scooter.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <Link href={`/app/scooters/${scooter.id}`}>
                {/* Scooter Card Content */}
                <div className="p-4 flex gap-4">
                  {/* Image Placeholder */}
                  <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    <ScooterImage
                      brand={scooter.brand}
                      model={scooter.model}
                      scooterId={scooter.id}
                      imageUrl={scooter.image_url}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                          {scooter.model}
                        </h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                          {scooter.brand} • {scooter.engine_cc}cc
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-green-600">
                          {scooter.daily_price}฿
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${scooter.is_active ? "bg-green-500" : "bg-red-400"}`}
                        ></span>
                        <span className="text-xs font-medium text-gray-500">
                          {scooter.is_active ? t('available') : t('unavailable')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        {t('bookNow')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900">Reviews</h2>
          {ratingStats.reviewCount > 0 && (
            <RatingSummary
              averageRating={ratingStats.averageRating}
              reviewCount={ratingStats.reviewCount}
            />
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-gray-500">
              No reviews yet. Be the first to leave a review!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
