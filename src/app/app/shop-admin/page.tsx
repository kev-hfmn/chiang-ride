import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Settings, Store } from 'lucide-react'

export default async function ShopAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let shops: any[] | null = []

  if (user) {
    // Fetch my shops real data
    const { data } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
    shops = data
  } else {
    // DEMO MODE: Fetch the first shop to show as "mine"
    const { data } = await supabase
      .from('shops')
      .select('*')
      .limit(1)
    shops = data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">Partner Dashboard</h1>
           <p className="text-sm text-gray-500">Manage your fleet and bookings</p>
        </div>
        <Link href="/app/shop-admin/new" className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 shadow-sm shadow-orange-200 transition-all">
          <Plus className="w-5 h-5" />
          Add Shop
        </Link>
      </div>

      {!user && (
         <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm flex gap-3 items-start">
            <span className="text-xl">👋</span>
            <div>
                <p className="font-bold">Demo Mode Active</p>
                <p>You are viewing this dashboard as a guest. In a real scenario, you would only see shops you own.</p>
            </div>
         </div>
      )}

      <div className="grid gap-4">
        {shops?.map((shop) => (
          <div key={shop.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Store className="w-6 h-6" />
               </div>
               <div>
                <h3 className="font-bold text-gray-900 text-lg">{shop.name}</h3>
                <p className="text-sm text-gray-500">{shop.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                href={`/app/shops/${shop.id}`}
                className="px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                View Live
              </Link>
              <Link 
                href={`/app/shops/${shop.id}`}
                className="px-4 py-2 rounded-lg bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Fleet
              </Link>
            </div>
          </div>
        ))}
        {(!shops || shops.length === 0) && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
             <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-gray-500 font-medium">You haven't listed any shops yet.</p>
             <button className="text-orange-600 font-bold hover:underline">Create your first listing</button>
          </div>
        )}
      </div>
    </div>
  )
}
