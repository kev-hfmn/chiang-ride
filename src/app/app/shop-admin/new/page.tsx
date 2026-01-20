'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Store, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export default function NewShopPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const description = formData.get('description') as string

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Demo simulation
      setTimeout(() => {
        setLoading(false)
        alert("This is a demo! In a real app, this shop would be saved to your account.")
        router.push('/app/shop-admin')
      }, 1000)
      return
    }

    const { error: insertError } = await supabase
      .from('shops')
      .insert({
        name,
        address,
        city,
        description,
        owner_id: user.id
      })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
    } else {
      router.push('/app/shop-admin')
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/app/shop-admin" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Shop</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-orange-50 p-6 flex items-center justify-center border-b border-orange-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
                🏪
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
                    <div className="relative">
                        <Store className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input 
                            name="name" 
                            type="text" 
                            required 
                            placeholder="e.g. KV Riders"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                        <select 
                            name="city" 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Chiang Mai">Chiang Mai</option>
                            <option value="Pai">Pai</option>
                            <option value="Chiang Rai">Chiang Rai</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                name="phone" 
                                type="tel" 
                                placeholder="081-234-5678"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea 
                            name="address" 
                            required 
                            rows={2}
                            placeholder="Full street address..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                        name="description" 
                        rows={3}
                        placeholder="Tell renters about your shop..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                </div>
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 hover:transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Create Shop'
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
