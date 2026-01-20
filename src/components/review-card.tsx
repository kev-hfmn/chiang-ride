import { Star } from "lucide-react";
import { Review } from "@/lib/types/custom";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-bold text-gray-900">{review.reviewer_name}</div>
          <div className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-gray-600 text-sm leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "md" }: StarRatingProps) {
  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

interface RatingSummaryProps {
  averageRating: number;
  reviewCount: number;
}

export function RatingSummary({
  averageRating,
  reviewCount,
}: RatingSummaryProps) {
  if (reviewCount === 0) {
    return <div className="text-sm text-gray-400">No reviews yet</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={averageRating} />
      <span className="font-bold text-gray-900">{averageRating}</span>
      <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
    </div>
  );
}

interface RatingBadgeProps {
  averageRating: number;
  reviewCount: number;
}

export function RatingBadge({ averageRating, reviewCount }: RatingBadgeProps) {
  if (reviewCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-bold text-gray-700">{averageRating}</span>
      <span className="text-gray-400">({reviewCount})</span>
    </div>
  );
}
