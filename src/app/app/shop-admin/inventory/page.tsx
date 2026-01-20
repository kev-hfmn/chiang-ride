'use client'

import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Link href="/app/shop-admin" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Fleet Inventory</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-4">
             <Construction className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Under Construction</h2>
        <p className="text-gray-500 text-center max-w-sm mt-2">
            This page will allow shop owners to manage their scooters, availability, and pricing.
        </p>
      </div>
    </div>
  )
}
