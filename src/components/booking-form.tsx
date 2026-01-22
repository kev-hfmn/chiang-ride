"use client";

import { useState, useActionState } from "react";
import { createBookingRequestAction } from "@/app/actions/renter";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { calculateBookingPrice } from "@/lib/services/booking-service";
import { Scooter } from "@/lib/types/custom";

interface BookingFormProps {
  scooter: Scooter;
  shopId: string;
}

export default function BookingForm({ scooter, shopId }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, formAction, isPending] = useActionState(createBookingRequestAction, {
    error: undefined as string | undefined,
  });

  const today = new Date().toISOString().split("T")[0];

  const BOOKING_FEE_PERCENT = 5; // 5% service fee

  const calculateTotal = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start);
    if (days <= 0) return null;

    // Use the centralized booking price calculation
    const pricing = calculateBookingPrice(
      scooter.daily_price,
      scooter.weekly_price || null,
      scooter.monthly_price || null,
      0, // No deposit for display purposes
      days,
      BOOKING_FEE_PERCENT
    );

    return {
      days: pricing.rentalDays,
      rentalPrice: pricing.subtotal,
      bookingFee: pricing.bookingFee,
      totalPrice: pricing.subtotal + pricing.bookingFee,
      priceBreakdown: pricing.priceBreakdown,
    };
  };

  const totals = calculateTotal();

  return (
    <form
      action={formAction}
      className="bg-gray-50 rounded-xl p-4 space-y-4"
    >
      <input type="hidden" name="scooter_id" value={scooter.id} />
      <input type="hidden" name="shop_id" value={shopId} />
      <input type="hidden" name="total_price" value={totals?.totalPrice || 0} />
      <input type="hidden" name="total_days" value={totals?.days || 0} />
      <input type="hidden" name="booking_fee" value={totals?.bookingFee || 0} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Pickup
          </label>
          <input
            type="date"
            name="start_date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Dropoff
          </label>
          <input
            type="date"
            name="end_date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500"
            required
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-red-500 text-xs font-bold">{state.error}</p>
      )}

      {totals && (
        <div className="border-t border-gray-200 mt-2 pt-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {totals.days} days
            </span>
            <span className="font-medium text-gray-700">
              {totals.rentalPrice}฿
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Chiang Ride fee <span className="text-gray-400">(5%)</span>
            </span>
            <span className="font-medium text-gray-700">
              {totals.bookingFee}฿
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-lg font-extrabold text-gray-900">
              {totals.totalPrice}฿
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!totals || isPending}
        className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending Request...
          </>
        ) : (
          "Request to Book"
        )}
      </button>
    </form>
  );
}
