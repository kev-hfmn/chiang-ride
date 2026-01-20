import { createClient } from '@/lib/supabase/server'
import { getShop, getScooters } from '@/lib/db/shops'
import { notFound } from 'next/navigation'
import { AvailabilityGrid } from '@/components/availability-grid'
import { MapPin, ShieldCheck, Check } from 'lucide-react'

export default async function ShopDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const shop = await getShop(id)
  
  if (!shop) {
    notFound()
  }

  const scooters = await getScooters(id)
  const supabase = await createClient()

  // Fetch availability for all scooters in this shop (optimization: could filter by date)
  const { data: availability } = await supabase
    .from('availability_days')
    .select('*')
    .in('scooter_id', scooters?.map(s => s.id) || [])
    .gte('day', new Date().toISOString().split('T')[0])

  // Get current user to see if they are the owner (though this is the public view, owners might view it too)
  const { data: { user } } = await supabase.auth.getUser()
  // Default to false if no user, allowing anonymous browsing
  const isOwner = user ? user.id === shop.owner_id : false

  return (
    <div className="space-y-8 pb-24">
      {/* Shop Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-green-700 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            {isOwner && (
                <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                  Your Shop
                </span>
            )}
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md p-1">
                <div className="w-full h-full bg-green-50 rounded-xl flex items-center justify-center text-3xl">🛵</div>
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold text-gray-900">{shop.name}</h1>
                    {shop.is_verified && <ShieldCheck className="w-6 h-6 text-orange-500" />}
                    </div>
                    <div className="flex items-center text-gray-500 mt-1 font-medium">
                    <MapPin className="w-4 h-4 mr-1" />
                    {shop.address}, {shop.city}
                    </div>
                </div>
                <button className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm">
                    Contact Shop
                </button>
            </div>
            
            <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">{shop.description}</p>
        </div>
      </div>

      {/* Fleet Section */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            Available Fleet
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{scooters?.length || 0}</span>
        </h2>
        
        <div className="grid gap-6">
          {scooters?.map((scooter) => {
            const scooterAvailability = availability?.filter(a => a.scooter_id === scooter.id) || []
            
            return (
              <div key={scooter.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                      {/* Scooter Image Placeholder */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0"></div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{scooter.model}</h3>
                        <p className="text-sm text-gray-500">{scooter.brand} • {scooter.engine_cc}cc</p>
                        <div className="flex gap-2 mt-2">
                             <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-medium border border-green-100">
                                Automatic
                             </span>
                             <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded font-medium border border-gray-100">
                                2 Helmets
                             </span>
                        </div>
                      </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-extrabold text-xl text-green-700">฿{scooter.daily_price}</span>
                        <span className="text-xs text-gray-400 font-medium">/ day</span>
                    </div>
                    {scooter.deposit_amount > 0 ? (
                       <p className="text-xs text-orange-600 mt-1 font-medium">Dep: ฿{scooter.deposit_amount}</p>
                    ) : (
                        <p className="text-xs text-green-600 mt-1 font-medium flex items-center justify-end gap-1">
                            <Check className="w-3 h-3" /> No Deposit
                        </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Availability (Next 14 Days)</p>
                      <div className="flex gap-3 text-xs">
                          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Free</span>
                          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-red-400"></span> Booked</span>
                      </div>
                  </div>
                  <AvailabilityGrid 
                    scooterId={scooter.id} 
                    initialAvailability={scooterAvailability}
                    isOwner={isOwner}
                  />
                  
                  <button className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-xl shadow hover:bg-orange-600 transition-colors">
                      Book Dates
                  </button>
                </div>
              </div>
            )
          })}
          
          {(!scooters || scooters.length === 0) && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">This shop hasn't listed any scooters yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
