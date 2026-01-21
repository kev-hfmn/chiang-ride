import { getFeaturedScooters } from '@/lib/db/shops'
import { ScooterListWithFilters } from '@/components/scooter-list-with-filters'
import { Bike } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const scooters = await getFeaturedScooters(20)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Find your perfect ride in Chiang Mai</p>
      </div>

      {/* Featured Scooters with Filters */}
      {scooters.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-gray-200 shadow-none">
          <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bike className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">No scooters available</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Check back soon or browse our partner shops.
          </p>
          <Button asChild variant="default">
            <Link href="/shops">Browse shops</Link>
          </Button>
        </Card>
      ) : (
        <ScooterListWithFilters scooters={scooters} />
      )}

      {/* Browse All Link */}
      {scooters.length > 0 && (
        <div className="text-center">
          <Link
            href="/shops"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            Browse all shops
          </Link>
        </div>
      )}
    </div>
  )
}
