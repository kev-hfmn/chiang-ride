import { getShop, getScooters, getScooterAvailability } from '@/lib/db/shops'
import { ShopDetailView } from '@/components/shop-detail-view'

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shop = await getShop(id)
  const scootersData = await getScooters(id)

  const scooters = await Promise.all(
    (scootersData || []).map(async (scooter: any) => {
      const availability = await getScooterAvailability(scooter.id)
      return { ...scooter, availability }
    })
  )

  if (!shop) return <div>Shop not found</div>

  return <ShopDetailView shop={shop} scooters={scooters} />
}
