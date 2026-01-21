import { createAdminClient } from "@/lib/supabase/admin";
import { Calendar, MapPin, Bike } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "outline" => {
    switch (status) {
      case "active":
        return "success";
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-extrabold text-gray-900">My Rentals</h1>

      <div className="space-y-4">
        {rentals.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 border-gray-200 shadow-none">
            <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bike className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">No trips yet</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              You haven't booked any scooters yet.
            </p>
            <Button asChild variant="default">
              <Link href="/dashboard">Find a bike</Link>
            </Button>
          </Card>
        ) : (
          rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {rental.scooters?.brand} {rental.scooters?.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {rental.shops?.name}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(rental.status)}>
                    {rental.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Dates
                    </div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(new Date(rental.start_date), "MMM d")} –{" "}
                      {format(new Date(rental.end_date), "MMM d")}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Total
                    </div>
                    <div className="font-bold text-gray-900 text-lg">
                      {rental.total_price}฿
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {rental.shops?.address}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
