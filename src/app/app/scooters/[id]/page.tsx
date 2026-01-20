import { notFound } from 'next/navigation'
import { getScooter, getScooterAvailability } from '@/lib/db/shops'
import { ScooterDetailView } from '@/components/scooter-detail-view'

export default async function ScooterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const scooter = await getScooter(id)

  if (!scooter) {
    notFound()
  }

  const availability = await getScooterAvailability(id)

  return <ScooterDetailView scooter={scooter} availability={availability} />
}
