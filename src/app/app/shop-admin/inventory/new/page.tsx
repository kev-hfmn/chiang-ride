'use client'

import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addScooterAction } from '@/app/actions/inventory'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

export default function NewScooterPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/shop-admin/inventory" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('addNewScooter')}</h1>
          <p className="text-gray-500 text-sm">{t('expandFleet')}</p>
        </div>
      </div>

      <form 
        action={async (formData) => {
          await addScooterAction(formData)
        }} 
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6"
      >
        
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-bold text-gray-900">{t('brand')}</label>
            <select 
                name="brand" 
                id="brand"
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                required
            >
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Vespa">Vespa</option>
                <option value="GPX">GPX</option>
            </select>
            </div>

            <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-bold text-gray-900">{t('modelName')}</label>
            <input 
                type="text" 
                name="model" 
                id="model" 
                placeholder={t('exampleModel')}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                required
            />
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
             <div className="space-y-2">
                <label htmlFor="engine_cc" className="text-sm font-bold text-gray-900">{t('engineSize')}</label>
                <input 
                    type="number" 
                    name="engine_cc" 
                    id="engine_cc" 
                    defaultValue="125"
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="daily_price" className="text-sm font-bold text-gray-900">{t('dailyPrice')}</label>
                <input 
                    type="number" 
                    name="daily_price" 
                    id="daily_price" 
                    placeholder="250"
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="deposit_amount" className="text-sm font-bold text-gray-900">{t('depositAmount')}</label>
                <input 
                    type="number" 
                    name="deposit_amount" 
                    id="deposit_amount" 
                    defaultValue="1000"
                    placeholder="1000"
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900 placeholder-gray-500"
                />
            </div>
        </div>

        <div className="pt-4">
            <button 
                type="submit" 
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
                <Save className="w-5 h-5" />
                {t('addToFleet')}
            </button>
        </div>
      </form>
    </div>
  )
}
