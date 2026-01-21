'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Store, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function NewShopPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfoMessage(null)

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
        setInfoMessage('Demo mode: this shop was not saved to an account.')
        setTimeout(() => router.push('/admin'), 800)
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
      router.push('/admin')
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/admin">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Shop</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-orange-50 p-6 flex items-center justify-center border-b border-orange-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
            🏪
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {infoMessage && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                {infoMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. KV Riders"
                    className="h-11 pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <Select name="city" defaultValue="Chiang Mai">
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiang Mai">Chiang Mai</SelectItem>
                      <SelectItem value="Pai">Pai</SelectItem>
                      <SelectItem value="Chiang Rai">Chiang Rai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="081-234-5678"
                      className="h-11 pl-10 rounded-xl"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Tell renters about your shop..."
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 font-bold"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Shop'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
