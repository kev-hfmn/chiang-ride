'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Drawer } from 'vaul'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CameraUpload } from '@/components/ui/camera-upload'
import { addScooterAction } from '@/app/actions/inventory'

interface AddScooterDrawerProps {
  translations: {
    addNewScooter: string
    expandFleet: string
    brand: string
    modelName: string
    exampleModel: string
    engineSize: string
    dailyPrice: string
    depositAmount: string
    numberPlate: string
    mainImage: string
    addToFleet: string
  }
}

export function AddScooterDrawer({ translations: t }: AddScooterDrawerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState('')

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => router.push('/admin/inventory'), 300)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      // Add the main image to form data
      formData.set('main_image', mainImage)
      await addScooterAction(formData)
      handleClose()
    } catch (error) {
      console.error('Failed to add scooter:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] max-h-[75dvh] fixed bottom-0 left-0 right-0 z-50">
          {/* Handle */}
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mt-4 mb-6" />

          {/* Header */}
          <div className="flex items-center gap-4 px-6 pb-4 border-b">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{t.addNewScooter}</h1>
              <p className="text-gray-500 text-sm">{t.expandFleet}</p>
            </div>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[calc(75dvh-120px)]">
            <form action={handleSubmit} className="space-y-6 pb-6">
              {/* Brand */}
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-bold text-gray-900">
                  {t.brand}
                </label>
                <select
                  name="brand"
                  id="brand"
                  className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                  defaultValue="Honda"
                  required
                >
                  <option value="Honda">Honda</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Vespa">Vespa</option>
                  <option value="GPX">GPX</option>
                </select>
              </div>

              {/* Model Name */}
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-bold text-gray-900">
                  {t.modelName}
                </label>
                <Input
                  type="text"
                  name="model"
                  id="model"
                  placeholder={t.exampleModel}
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Engine Size */}
              <div className="space-y-2">
                <label htmlFor="engine_cc" className="text-sm font-bold text-gray-900">
                  {t.engineSize}
                </label>
                <Input
                  type="number"
                  name="engine_cc"
                  id="engine_cc"
                  defaultValue="125"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Daily Price */}
              <div className="space-y-2">
                <label htmlFor="daily_price" className="text-sm font-bold text-gray-900">
                  {t.dailyPrice}
                </label>
                <Input
                  type="number"
                  name="daily_price"
                  id="daily_price"
                  placeholder="250"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Deposit Amount */}
              <div className="space-y-2">
                <label htmlFor="deposit_amount" className="text-sm font-bold text-gray-900">
                  {t.depositAmount}
                </label>
                <Input
                  type="number"
                  name="deposit_amount"
                  id="deposit_amount"
                  defaultValue="1000"
                  placeholder="1000"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Number Plate */}
              <div className="space-y-2">
                <label htmlFor="number_plate" className="text-sm font-bold text-gray-900">
                  {t.numberPlate}
                </label>
                <Input
                  type="text"
                  name="number_plate"
                  id="number_plate"
                  placeholder="ABC-1234"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Main Image */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">
                  {t.mainImage}
                </label>
                <CameraUpload
                  onImageUpload={setMainImage}
                  currentImage={mainImage}
                  bucketName="scooter-images"
                />
              </div>

              {/* Submit Button - Fixed at bottom */}
              <div className="sticky bottom-0 pt-4 pb-2 bg-white">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? 'Adding...' : t.addToFleet}
                </Button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
