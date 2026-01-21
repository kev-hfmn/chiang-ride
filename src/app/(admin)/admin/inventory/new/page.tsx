'use client'

import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addScooterAction } from '@/app/actions/inventory'
import { useLanguage } from '@/lib/i18n/language-context'
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

export default function NewScooterPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/admin/inventory">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('addNewScooter')}</h1>
          <p className="text-gray-500 text-sm">{t('expandFleet')}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form
            action={async (formData) => {
              await addScooterAction(formData)
            }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-bold text-gray-900">{t('brand')}</label>
                <Select name="brand" defaultValue="Honda" required>
                  <SelectTrigger className="w-full h-12 rounded-xl">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Honda">Honda</SelectItem>
                    <SelectItem value="Yamaha">Yamaha</SelectItem>
                    <SelectItem value="Vespa">Vespa</SelectItem>
                    <SelectItem value="GPX">GPX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-bold text-gray-900">{t('modelName')}</label>
                <Input
                  type="text"
                  name="model"
                  id="model"
                  placeholder={t('exampleModel')}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="engine_cc" className="text-sm font-bold text-gray-900">{t('engineSize')}</label>
                <Input
                  type="number"
                  name="engine_cc"
                  id="engine_cc"
                  defaultValue="125"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="daily_price" className="text-sm font-bold text-gray-900">{t('dailyPrice')}</label>
                <Input
                  type="number"
                  name="daily_price"
                  id="daily_price"
                  placeholder="250"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="deposit_amount" className="text-sm font-bold text-gray-900">{t('depositAmount')}</label>
                <Input
                  type="number"
                  name="deposit_amount"
                  id="deposit_amount"
                  defaultValue="1000"
                  placeholder="1000"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold"
              >
                <Save className="w-5 h-5" />
                {t('addToFleet')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
