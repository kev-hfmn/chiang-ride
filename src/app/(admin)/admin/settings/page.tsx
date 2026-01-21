import { getAdminShop } from '@/lib/db/admin'
import { Save, MapPin, AlertCircle } from 'lucide-react'
import { updateShopSettingsAction } from '@/app/actions/shop-settings'
import { getTranslations } from '@/lib/i18n/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function ShopSettingsPage() {
  const shop = await getAdminShop()
  const { t } = await getTranslations()

  if (!shop) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
          <h2 className="text-xl font-bold text-gray-900">{t('shopNotFound')}</h2>
          <p className="text-gray-500">{t('seedScriptHint')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('shopSettings')}</h1>
          <p className="text-sm text-gray-500">{t('manageSettings')}</p>
        </div>
      </div>

      <form action={updateShopSettingsAction} className="space-y-6">
        <input type="hidden" name="shop_id" value={shop.id} />

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-base">{t('basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('shopName')}</label>
              <Input
                type="text"
                name="name"
                defaultValue={shop.name}
                className="h-12 rounded-xl font-semibold"
                placeholder="e.g. Chiang Mai Scooters"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('description')}</label>
              <textarea
                name="description"
                defaultValue={shop.description || ''}
                rows={3}
                className="w-full bg-white border border-input focus:border-ring focus:ring-2 focus:ring-ring/50 rounded-xl px-4 py-3 font-medium text-gray-900 transition-all outline-none resize-none"
                placeholder="Tell renters about your shop..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              {t('location')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('address')}</label>
              <Input
                type="text"
                name="address"
                defaultValue={shop.address || ''}
                className="h-12 rounded-xl"
                placeholder="e.g. 123 Nimman Road"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('city')}</label>
              <Input
                type="text"
                name="city"
                defaultValue={shop.city || 'Chiang Mai'}
                className="h-12 rounded-xl"
                placeholder="Chiang Mai"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('latitude')}</label>
                <Input
                  type="number"
                  step="any"
                  name="location_lat"
                  defaultValue={shop.location_lat || ''}
                  className="h-12 rounded-xl"
                  placeholder="18.7883"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('longitude')}</label>
                <Input
                  type="number"
                  step="any"
                  name="location_lng"
                  defaultValue={shop.location_lng || ''}
                  className="h-12 rounded-xl"
                  placeholder="98.9853"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {t('locationTip')}
            </p>
          </CardContent>
        </Card>

        {/* Deposit Policy */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-base">{t('depositPolicy')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('defaultDepositAmount')}</label>
              <Input
                type="number"
                name="deposit_amount"
                defaultValue={shop.deposit_amount || 1000}
                className="h-12 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{t('depositPolicyText')}</label>
              <textarea
                name="deposit_policy_text"
                defaultValue={shop.deposit_policy_text || 'Standard 1000 THB deposit or Passport'}
                rows={4}
                className="w-full bg-white border border-input focus:border-ring focus:ring-2 focus:ring-ring/50 rounded-xl px-4 py-3 font-medium text-gray-900 transition-all outline-none resize-none"
                placeholder="Explain your deposit requirements..."
              />
              <p className="text-xs text-gray-400 mt-2">{t('depositPolicyHint')}</p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-lg font-bold"
        >
          <Save className="w-5 h-5" />
          {t('saveChanges')}
        </Button>
      </form>
    </div>
  )
}
