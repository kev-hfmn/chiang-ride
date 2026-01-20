import { createClient } from '@/lib/supabase/client'
import { getAdminShop } from '@/lib/db/admin'
import { Save } from 'lucide-react'
import { updateShopSettingsAction } from '@/app/actions/shop-settings'

export default async function ShopSettingsPage() {
  const shop = await getAdminShop()
  
  if (!shop) {
    return <div>Shop not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500">Manage your store profile and policies.</p>
      </div>

      <form action={updateShopSettingsAction} className="space-y-6">
        <input type="hidden" name="shop_id" value={shop.id} />
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Info</h2>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Shop Name</label>
                <input 
                    type="text" 
                    name="name" 
                    defaultValue={shop.name}
                    className="w-full bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all outline-none"
                    placeholder="e.g. Chiang Mai Scooters"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea 
                    name="description" 
                    defaultValue={shop.description}
                    rows={3}
                    className="w-full bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-xl px-4 py-3 font-medium text-gray-900 transition-all outline-none resize-none"
                    placeholder="Tell renters about your shop..."
                />
            </div>
        </div>

        {/* Deposit Policy */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Deposit Policy</h2>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Deposit Amount (THB)</label>
                <input 
                    type="number" 
                    name="deposit_amount" 
                    defaultValue={shop.deposit_amount || 1000}
                    className="w-full bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all outline-none"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deposit Policy Text</label>
                <textarea 
                    name="deposit_policy_text" 
                    defaultValue={shop.deposit_policy_text || "Standard 1000 THB deposit or Passport"}
                    rows={4}
                    className="w-full bg-white border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 rounded-xl px-4 py-3 font-medium text-gray-900 transition-all outline-none resize-none"
                    placeholder="Explain your deposit requirements..."
                />
                <p className="text-xs text-gray-400 mt-2">This will be shown on every bike listing.</p>
            </div>
        </div>

        <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
        >
            <Save className="w-5 h-5" />
            Save Changes
        </button>
      </form>
    </div>
  )
}
