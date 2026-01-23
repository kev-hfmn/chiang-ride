import { getShop, getScooters } from "@/lib/db/shops";
import { getShopReviews, getShopRatingStats } from "@/lib/db/reviews";
import { getScootersAvailabilityToday } from "@/lib/db/availability";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  Share,
  Heart,
} from "lucide-react";
import { getTranslations } from "@/lib/i18n/server";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScooterCard } from "@/components/scooter-list/scooter-card";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getTranslations();

  const [shop, scooters, reviews, ratingStats] = await Promise.all([
    getShop(id),
    getScooters(id),
    getShopReviews(id),
    getShopRatingStats(id),
  ]);

  if (!shop) return <div>Shop not found</div>;

  // Fetch today's availability for all scooters
  const scooterIds = scooters.map(s => s.id);
  const availabilityMap = await getScootersAvailabilityToday(scooterIds);

  return (
    <div className="-mx-2 md:-mx-6 -mt-6 md:-mt-10">
      {/* Sub Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <Link
          href="/shops"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">{t("backToExplore")}</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/10] bg-gray-100">
        {shop.image_url ? (
          <OptimizedImage
            src={shop.image_url}
            alt={shop.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-orange-600 font-semibold">{shop.name}</p>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {shop.is_verified && (
          <Badge className="absolute bottom-3 left-3 bg-white text-gray-800 shadow-md border-0 px-2.5 py-1">
            <Star className="w-3 h-3 fill-orange-500 text-orange-500 mr-1" />
            {t("verifiedPartner")}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="px-2 pt-5 space-y-5 pb-6">
        {/* Shop Title & Info */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{shop.address || t("chiangMaiThailand")}</span>
            </div>

            {ratingStats.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900">
                  {ratingStats.averageRating}
                </span>
                <span className="text-gray-400">
                  ({ratingStats.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Description */}
        <p className="text-gray-600 text-[15px] leading-relaxed">
          {shop.description || t("defaultShopDescription")}
        </p>

        {/* Deposit Policy */}
        <div className="bg-green-50 rounded-2xl p-4 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {t("depositPolicy")}
            </p>
            <p className="text-gray-600 text-sm mt-0.5">
              {shop.deposit_policy_text || t("defaultDepositPolicy")}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-6" />

        {/* Fleet Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {t("availableBikes")}
            </h2>
            <span className="text-sm text-gray-400">
              {scooters?.length || 0} bikes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
            {scooters?.map((scooter) => (
              <ScooterCard 
                key={scooter.id} 
                scooter={scooter}
                availableToday={availabilityMap.get(scooter.id)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-6" />

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <h2 className="text-lg font-bold text-gray-900">
              {ratingStats.averageRating > 0 && (
                <span>{ratingStats.averageRating} · </span>
              )}
              {ratingStats.reviewCount}{" "}
              {ratingStats.reviewCount === 1 ? "Review" : "Reviews"}
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-10 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">
                No reviews yet. Be the first to leave a review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-900 text-white font-semibold text-sm">
                        {review.reviewer_name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.reviewer_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 ml-[52px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed ml-[52px]">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
