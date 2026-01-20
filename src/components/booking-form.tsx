"use client";

import { useState } from "react";
import { createBookingRequestAction } from "@/app/actions/renter";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";

interface BookingFormProps {
  scooter: any;
  shopId: string;
}

export default function BookingForm({ scooter, shopId }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const calculateTotal = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start);
    if (days <= 0) return null;

    return {
      days,
      price: days * scooter.daily_price,
    };
  };

  const totals = calculateTotal();

  console.log(totals, isSubmitting);

  return (
    <form
      action={createBookingRequestAction}
      onSubmit={() => setIsSubmitting(true)}
      className="bg-gray-50 rounded-xl p-4 space-y-4"
    >
      <input type="hidden" name="scooter_id" value={scooter.id} />
      <input type="hidden" name="shop_id" value={shopId} />
      <input type="hidden" name="total_price" value={totals?.price || 0} />
      <input type="hidden" name="total_days" value={totals?.days || 0} />

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

      {totals && (
        <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-2">
          <span className="text-sm font-bold text-gray-500">
            {totals.days} Days
          </span>
          <span className="text-lg font-extrabold text-gray-900">
            {totals.price}฿{" "}
            <span className="text-xs font-normal text-gray-400">Total</span>
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!totals || isSubmitting}
        className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
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
