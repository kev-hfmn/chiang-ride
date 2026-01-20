import { createClient } from '@/lib/supabase/server'
import { Search, MapPin, Calendar, SlidersHorizontal } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const displayName = profile?.full_name || 'Kevin' // Demo name fallback

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">Ready to ride, {displayName}? 🛵</h1>
           <p className="text-gray-500 mt-1">Found 124 available scooters in Chiang Mai.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all font-medium"
            placeholder="Where do you want to pick up?"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
             <button className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-100 shadow-sm">
                <SlidersHorizontal className="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-bold text-gray-900">Recommended for you</h2>
           <a href="/app/shops" className="text-sm font-semibold text-orange-600 hover:text-orange-700">See all</a>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
           {/* Demo Card 1 */}
           <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <div className="h-32 bg-gray-200 relative mb-2">
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     Available
                  </div>
              </div>
              <div className="p-4">
                 <h3 className="font-bold text-gray-900">Honda Click 125i</h3>
                 <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> Nimman Road • Mango Bikes
                 </p>
                 <div className="mt-3 flex items-center justify-between">
                    <div>
                       <span className="text-lg font-extrabold text-gray-900">250฿</span>
                       <span className="text-xs text-gray-500">/day</span>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">
                       Book Now
                    </button>
                 </div>
              </div>
           </div>

           {/* Demo Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <div className="h-32 bg-gray-200 relative mb-2">
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     Available
                  </div>
              </div>
              <div className="p-4">
                 <h3 className="font-bold text-gray-900">Honda Scoopy i</h3>
                 <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> Old City • Thai Ride
                 </p>
                 <div className="mt-3 flex items-center justify-between">
                    <div>
                       <span className="text-lg font-extrabold text-gray-900">200฿</span>
                       <span className="text-xs text-gray-500">/day</span>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">
                       Book Now
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
