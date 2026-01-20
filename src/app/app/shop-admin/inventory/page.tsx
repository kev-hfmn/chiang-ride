import Link from "next/link";
import { Plus, Settings, AlertCircle, Calendar } from "lucide-react";
import { getAdminShop, getAdminInventory } from "@/lib/db/admin";
import { ScooterImage } from "@/components/scooter-image";

export default async function InventoryPage() {
  const shop = await getAdminShop();

  if (!shop) {
    return (
      <div className="p-8 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
        <h2 className="text-xl font-bold text-gray-900">Shop Not Found</h2>
        <p>Please log in or contact support.</p>
      </div>
    );
  }

  const scooters = await getAdminInventory(shop.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Fleet Inventory
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your bikes and pricing.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/app/shop-admin/calendar"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline">Availability</span>
          </Link>
          <Link
            href="/app/shop-admin/inventory/new"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Scooter</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 overflow-hidden">
        {scooters.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No scooters in your fleet yet.</p>
          </div>
        ) : (
          scooters.map((scooter) => (
            <div
              key={scooter.id}
              className="group flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden">
                <ScooterImage
                  brand={scooter.brand}
                  model={scooter.model}
                  scooterId={scooter.id}
                  imageUrl={scooter.image_url}
                  className="w-full h-full object-cover"
                />
                {/* Status Dot */}
                <div
                  className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${scooter.is_active ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>

              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">
                    {scooter.model}
                  </h3>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {scooter.daily_price}฿
                    <span className="text-xs text-gray-500 font-normal">
                      /day
                    </span>
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
                    {scooter.engine_cc}cc
                  </span>
                  <span className="truncate">
                    Deposit: {scooter.deposit_amount}฿
                  </span>
                </div>
              </div>

              <Link
                href={`/app/shop-admin/inventory/${scooter.id}`}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg shrink-0"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
