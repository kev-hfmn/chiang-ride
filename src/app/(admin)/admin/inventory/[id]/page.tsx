import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { getScooter } from '@/lib/db/shops'
import { getAdminShop } from '@/lib/db/admin'
import { getTranslations } from '@/lib/i18n/server'
import { Card, CardContent } from '@/components/ui/card'
import { EditScooterDrawer } from '@/components/admin/edit-scooter-drawer'

export default async function EditScooterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { t } = await getTranslations()

  // Fetch data
  const shop = await getAdminShop()
  const scooter = await getScooter(id)

  if (!shop || !scooter) {
    notFound()
  }

  // Security Block: Ensure this scooter belongs to the logged-in shop
  if (scooter.shop_id !== shop.id) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">{t('unauthorized')}</h1>
          <p className="text-gray-500">{t('noPermissionEdit')}</p>
          <Link href="/admin/inventory" className="text-blue-500 hover:underline">{t('returnToInventory')}</Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <EditScooterDrawer
      scooter={{
        id: scooter.id,
        brand: scooter.brand,
        model: scooter.model,
        engine_cc: scooter.engine_cc,
        daily_price: scooter.daily_price,
        deposit_amount: scooter.deposit_amount,
        is_active: scooter.is_active,
      }}
      translations={{
        editScooter: t('editScooter'),
        updateDetails: t('updateDetails'),
        brand: t('brand'),
        modelName: t('modelName'),
        exampleModel: t('exampleModel'),
        engineSize: t('engineSize'),
        dailyPrice: t('dailyPrice'),
        depositAmount: t('depositAmount'),
        availableForRent: t('availableForRent'),
        saveChanges: t('saveChanges'),
      }}
    />
  )
}
