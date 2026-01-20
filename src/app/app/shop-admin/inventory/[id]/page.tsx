import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react'
import { updateScooterAction } from '@/app/actions/inventory'
import { getScooter } from '@/lib/db/shops'
import { getAdminShop } from '@/lib/db/admin'

export default async function EditScooterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch data
  const shop = await getAdminShop()
  const scooter = await getScooter(id)

  if (!shop || !scooter) {
    notFound()
  }

  // Security Block: Ensure this scooter belongs to the logged-in shop
  if (scooter.shop_id !== shop.id) {
    return (
        <div className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold">Unauthorized</h1>
            <p className="text-gray-500">You do not have permission to edit this scooter.</p>
            <Link href="/app/shop-admin/inventory" className="text-blue-500 hover:underline">Return to Inventory</Link>
        </div>
    )
  }

  const updateAction = updateScooterAction.bind(null, id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/shop-admin/inventory" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Scooter</h1>
          <p className="text-gray-500 text-sm">Update details and availability.</p>
        </div>
      </div>

      <form 
        action={updateAction} 
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6"
      >
        
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-bold text-gray-900">Brand</label>
            <select 
                name="brand" 
                id="brand"
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                defaultValue={scooter.brand}
                required
            >
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Vespa">Vespa</option>
                <option value="GPX">GPX</option>
            </select>
            </div>

            <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-bold text-gray-900">Model Name</label>
            <input 
                type="text" 
                name="model" 
                id="model" 
                defaultValue={scooter.model}
                placeholder="e.g. Click 160, NMAX"
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                required
            />
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
             <div className="space-y-2">
                <label htmlFor="engine_cc" className="text-sm font-bold text-gray-900">Engine (cc)</label>
                <input 
                    type="number" 
                    name="engine_cc" 
                    id="engine_cc" 
                    defaultValue={scooter.engine_cc}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="daily_price" className="text-sm font-bold text-gray-900">Daily Price (฿)</label>
                <input 
                    type="number" 
                    name="daily_price" 
                    id="daily_price" 
                    defaultValue={scooter.daily_price}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="deposit_amount" className="text-sm font-bold text-gray-900">Deposit (฿)</label>
                <input 
                    type="number" 
                    name="deposit_amount" 
                    id="deposit_amount" 
                    defaultValue={scooter.deposit_amount}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                />
            </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
            <input 
                type="checkbox" 
                name="is_active" 
                id="is_active" 
                defaultChecked={scooter.is_active}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
            />
            <label htmlFor="is_active" className="text-gray-900 font-medium select-none">
                Available for Rent (Active)
            </label>
        </div>

        <div className="pt-4 flex gap-4">
            <button 
                type="submit" 
                className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
                <Save className="w-5 h-5" />
                Save Changes
            </button>
        </div>
      </form>
    </div>
  )
}
