import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin"; // Using admin for demo fetch
import { Calendar, Clock, MapPin, Smartphone } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

async function getMyRentals() {
  const supabase = createAdminClient();

  // For MVP demo: fetch bookings where renter_id is null (anonymous demo bookings)
  const { data } = await supabase
    .from("bookings")
    .select(
      `
            *,
            shops (name, address, location_lat, location_lng),
            scooters (model, brand, daily_price)
        `,
    )
    .is("renter_id", null)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function MyRentalsPage() {
  const rentals = await getMyRentals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-50 text-red-600";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">My Rentals</h1>

      <div className="space-y-4">
        {rentals.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-4xl">
              🛵
            </div>
            <h3 className="font-bold text-gray-900">No trips yet</h3>
            <p className="text-gray-500 text-sm">
              You haven't booked any scooters yet.
            </p>
            <Link
              href="/app/shops"
              className="inline-block text-orange-600 font-bold hover:underline"
            >
              Find a bike
            </Link>
          </div>
        ) : (
          rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">
                    {rental.scooters?.model}
                  </h3>
                  <div className="text-sm text-gray-500 font-medium">
                    {rental.shops?.name}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusColor(rental.status)}`}
                >
                  {rental.status}
                </span>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-gray-400 uppercase">
                    Dates
                  </div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {format(new Date(rental.start_date), "MMM d")} -{" "}
                    {format(new Date(rental.end_date), "MMM d")}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-xs font-bold text-gray-400 uppercase">
                    Total
                  </div>
                  <div className="font-extrabold text-gray-900">
                    {rental.total_price}฿
                  </div>
                </div>
              </div>

              {/* Location / Contact */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-orange-500" />
                {rental.shops?.address}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
