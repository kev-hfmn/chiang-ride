'use client'

import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { Drawer } from 'vaul'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScooterCard } from '@/components/scooter-card'
import { CameraUpload } from '@/components/ui/camera-upload'
import { updateScooterAction, addScooterAction } from '@/app/actions/inventory'

interface Scooter {
  id: string
  brand: string
  model: string
  engine_cc: number
  daily_price: number
  deposit_amount: number | null
  number_plate?: string | null
  main_image?: string | null
  is_active: boolean
  image_url?: string | null
}

interface InventoryListWithDrawerProps {
  scooters: Scooter[]
  translations: {
    fleetInventory: string
    manageInventory: string
    availabilityLink: string
    addScooter: string
    noScooters: string
    deposit: string
    editScooter: string
    updateDetails: string
    brand: string
    modelName: string
    exampleModel: string
    engineSize: string
    dailyPrice: string
    depositAmount: string
    numberPlate: string
    mainImage: string
    availableForRent: string
    saveChanges: string
    addNewScooter: string
    expandFleet: string
    addToFleet: string
  }
}

export function InventoryListWithDrawer({ scooters, translations: t }: InventoryListWithDrawerProps) {
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null)
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState('')

  const handleEdit = (scooter: Scooter) => {
    setSelectedScooter(scooter)
    setMainImage(scooter.main_image || '')
  }

  const handleAdd = () => {
    setShowAddDrawer(true)
    setMainImage('')
  }

  const handleClose = () => {
    setSelectedScooter(null)
    setShowAddDrawer(false)
  }

  const handleSubmit = async (formData: FormData) => {
    if (!selectedScooter) return

    setIsSubmitting(true)
    try {
      // Add the main image to form data
      formData.set('main_image', mainImage)
      await updateScooterAction(selectedScooter.id, formData)
      handleClose()
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Failed to update scooter:', error)
      setIsSubmitting(false)
    }
  }

  const handleSubmitAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      // Add the main image to form data
      formData.set('main_image', mainImage)
      await addScooterAction(formData)
      handleClose()
      // Refresh the page to show new scooter
      window.location.reload()
    } catch (error) {
      console.error('Failed to add scooter:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t.fleetInventory}</h1>
            <p className="text-gray-500 text-sm">{t.manageInventory}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleAdd}
              className="rounded-xl bg-orange-600 hover:bg-orange-700 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="">{t.addScooter}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scooters.length === 0 ? (
            <Card className="border-dashed sm:col-span-2">
              <CardContent className="p-8 text-center text-gray-500">
                {t.noScooters}
              </CardContent>
            </Card>
          ) : (
            scooters.map((scooter) => (
              <ScooterCard
                key={scooter.id}
                scooter={scooter}
                isAdmin={true}
                onEdit={() => handleEdit(scooter)}
                translations={{
                  deposit: t.deposit,
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Drawer */}
      <Drawer.Root open={!!selectedScooter} onOpenChange={(open) => !open && handleClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] max-h-[75dvh] fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mt-4 mb-6" />
            
            <div className="flex items-center gap-4 px-6 pb-4 border-b">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{t.editScooter}</h1>
                <p className="text-gray-500 text-sm">{t.updateDetails}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[calc(75dvh-120px)]">
              {selectedScooter && (
                <form action={handleSubmit} className="space-y-6 pb-6">
                  <div className="space-y-2">
                    <label htmlFor="brand" className="text-sm font-bold text-gray-900">
                      {t.brand}
                    </label>
                    <select
                      name="brand"
                      id="brand"
                      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                      defaultValue={selectedScooter.brand}
                      required
                    >
                      <option value="Honda">Honda</option>
                      <option value="Yamaha">Yamaha</option>
                      <option value="Vespa">Vespa</option>
                      <option value="GPX">GPX</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-bold text-gray-900">
                      {t.modelName}
                    </label>
                    <Input
                      type="text"
                      name="model"
                      id="model"
                      defaultValue={selectedScooter.model}
                      placeholder={t.exampleModel}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="engine_cc" className="text-sm font-bold text-gray-900">
                      {t.engineSize}
                    </label>
                    <Input
                      type="number"
                      name="engine_cc"
                      id="engine_cc"
                      defaultValue={selectedScooter.engine_cc}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="daily_price" className="text-sm font-bold text-gray-900">
                      {t.dailyPrice}
                    </label>
                    <Input
                      type="number"
                      name="daily_price"
                      id="daily_price"
                      defaultValue={selectedScooter.daily_price}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="deposit_amount" className="text-sm font-bold text-gray-900">
                      {t.depositAmount}
                    </label>
                    <Input
                      type="number"
                      name="deposit_amount"
                      id="deposit_amount"
                      defaultValue={selectedScooter.deposit_amount || ''}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="number_plate" className="text-sm font-bold text-gray-900">
                      {t.numberPlate}
                    </label>
                    <Input
                      type="text"
                      name="number_plate"
                      id="number_plate"
                      defaultValue={selectedScooter.number_plate || ''}
                      placeholder="ABC-1234"
                      className="h-12 rounded-xl"
                    />
                  </div>

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

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      id="is_active"
                      defaultChecked={selectedScooter.is_active}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                    />
                    <label htmlFor="is_active" className="text-gray-900 font-medium select-none">
                      {t.availableForRent}
                    </label>
                  </div>

                  <div className="sticky bottom-0 pt-4 pb-2 bg-white">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold"
                    >
                      {isSubmitting ? 'Saving...' : t.saveChanges}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Add Drawer */}
      <Drawer.Root open={showAddDrawer} onOpenChange={(open) => !open && handleClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] max-h-[75dvh] fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mt-4 mb-6" />

            <div className="flex items-center gap-4 px-6 pb-4 border-b">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{t.addNewScooter}</h1>
                <p className="text-gray-500 text-sm">{t.expandFleet}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[calc(75dvh-120px)]">
              <form action={handleSubmitAdd} className="space-y-6 pb-6">
                <div className="space-y-2">
                  <label htmlFor="add-brand" className="text-sm font-bold text-gray-900">
                    {t.brand}
                  </label>
                  <select
                    name="brand"
                    id="add-brand"
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

                <div className="space-y-2">
                  <label htmlFor="add-model" className="text-sm font-bold text-gray-900">
                    {t.modelName}
                  </label>
                  <Input
                    type="text"
                    name="model"
                    id="add-model"
                    placeholder={t.exampleModel}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="add-engine_cc" className="text-sm font-bold text-gray-900">
                    {t.engineSize}
                  </label>
                  <Input
                    type="number"
                    name="engine_cc"
                    id="add-engine_cc"
                    defaultValue="125"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="add-daily_price" className="text-sm font-bold text-gray-900">
                    {t.dailyPrice}
                  </label>
                  <Input
                    type="number"
                    name="daily_price"
                    id="add-daily_price"
                    placeholder="250"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="add-deposit_amount" className="text-sm font-bold text-gray-900">
                    {t.depositAmount}
                  </label>
                  <Input
                    type="number"
                    name="deposit_amount"
                    id="add-deposit_amount"
                    defaultValue="1000"
                    placeholder="1000"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="add-number_plate" className="text-sm font-bold text-gray-900">
                    {t.numberPlate}
                  </label>
                  <Input
                    type="text"
                    name="number_plate"
                    id="add-number_plate"
                    placeholder="ABC-1234"
                    className="h-12 rounded-xl"
                  />
                </div>

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
    </>
  )
}
