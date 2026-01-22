'use client'

import { AddScooterDrawer } from '@/components/admin/add-scooter-drawer'
import { useLanguage } from '@/lib/i18n/language-context'

export default function NewScooterPage() {
  const { t } = useLanguage()

  return (
    <AddScooterDrawer
      translations={{
        addNewScooter: t('addNewScooter'),
        expandFleet: t('expandFleet'),
        brand: t('brand'),
        modelName: t('modelName'),
        exampleModel: t('exampleModel'),
        engineSize: t('engineSize'),
        dailyPrice: t('dailyPrice'),
        depositAmount: t('depositAmount'),
        numberPlate: t('numberPlate'),
        mainImage: t('mainImage'),
        addToFleet: t('addToFleet'),
      }}
    />
  )
}
