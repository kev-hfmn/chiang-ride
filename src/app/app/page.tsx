import { createClient } from '@/lib/supabase/server'
import { getFeaturedScooters } from '@/lib/db/shops'
import Link from 'next/link'
import { ScooterListWithFilters } from '@/components/scooter-list-with-filters'

export const revalidate = 0

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

  const displayName = profile?.full_name || 'Rider'
  const scooters = await getFeaturedScooters(6)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Ready to ride, {displayName}?</h1>
        <p className="text-gray-500 mt-1">
          {scooters.length > 0
            ? `${scooters.length} scooters available in Chiang Mai`
            : 'Find your perfect scooter in Chiang Mai'}
        </p>
      </div>

      {/* Scooters with Filters */}
      {scooters.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No scooters available yet.</p>
          <Link href="/app/shops" className="text-green-600 font-semibold mt-2 inline-block">
            Browse shops instead
          </Link>
        </div>
      ) : (
        <ScooterListWithFilters scooters={scooters} />
      )}

      {/* Browse All Link */}
      <div className="text-center">
        <Link
          href="/app/shops"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
        >
          Browse all shops
        </Link>
      </div>
    </div>
  )
}
