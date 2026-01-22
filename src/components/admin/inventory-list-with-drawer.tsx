'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Save, Loader2 } from 'lucide-react'
import { Drawer } from 'vaul'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScooterCard } from '@/components/scooter-card'
import { CameraUpload } from '@/components/ui/camera-upload'
import { PricingInput } from '@/components/ui/pricing-input'
import { useToast } from '@/hooks/use-toast'
import { updateScooterAction, addScooterAction } from '@/app/actions/inventory'

interface Scooter {
  id: string
  brand: string
  model: string
  engine_cc: number
  daily_price: number
  weekly_price?: number | null
  monthly_price?: number | null
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

export function InventoryListWithDrawer({ scooters: initialScooters, translations: t }: InventoryListWithDrawerProps) {
  const [scooters, setScooters] = useState<Scooter[]>(initialScooters)
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null)
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState('')
  const [dailyPrice, setDailyPrice] = useState(0)
  const [weeklyPrice, setWeeklyPrice] = useState(0)
  const [monthlyPrice, setMonthlyPrice] = useState(0)
  const [addDailyPrice, setAddDailyPrice] = useState(0)
  const [addWeeklyPrice, setAddWeeklyPrice] = useState(0)
  const [addMonthlyPrice, setAddMonthlyPrice] = useState(0)
  const { showToast } = useToast()

  const handleEdit = (scooter: Scooter) => {
    setSelectedScooter(scooter)
    setMainImage(scooter.main_image || '')
    setDailyPrice(scooter.daily_price || 0)
    setWeeklyPrice(scooter.weekly_price || 0)
    setMonthlyPrice(scooter.monthly_price || 0)
  }

  const handleAdd = () => {
    setShowAddDrawer(true)
    setMainImage('')
    setAddDailyPrice(0)
    setAddWeeklyPrice(0)
    setAddMonthlyPrice(0)
  }

  const handleClose = () => {
    setSelectedScooter(null)
    setShowAddDrawer(false)
  }

  const handleSubmit = async (formData: FormData) => {
    if (!selectedScooter) return

    setIsSubmitting(true)
    
    try {
      // Add the main image and pricing to form data
      formData.set('main_image', mainImage)
      formData.set('daily_price', dailyPrice.toString())
      formData.set('weekly_price', weeklyPrice.toString())
      formData.set('monthly_price', monthlyPrice.toString())
      await updateScooterAction(selectedScooter.id, formData)
      
      // Optimistic update after successful server response
      const updatedScooter: Scooter = {
        ...selectedScooter,
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        engine_cc: parseInt(formData.get('engine_cc') as string) || selectedScooter.engine_cc,
        daily_price: dailyPrice,
        weekly_price: weeklyPrice || null,
        monthly_price: monthlyPrice || null,
        deposit_amount: parseInt(formData.get('deposit_amount') as string) || selectedScooter.deposit_amount,
        number_plate: formData.get('number_plate') as string || null,
        main_image: mainImage || null,
        is_active: formData.get('is_active') === 'on'
      }
      
      // Update UI after server success
      setScooters(prev => prev.map(s => s.id === selectedScooter.id ? updatedScooter : s))
      showToast.success('Scooter Updated', `${updatedScooter.model} has been updated successfully`)
      handleClose()
    } catch (error) {
      console.error('Failed to update scooter:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      showToast.error('Update Failed', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      // Add the main image and pricing to form data
      formData.set('main_image', mainImage)
      formData.set('daily_price', addDailyPrice.toString())
      formData.set('weekly_price', addWeeklyPrice.toString())
      formData.set('monthly_price', addMonthlyPrice.toString())
      await addScooterAction(formData)
      
      // Create new scooter after successful server response
      const newScooter: Scooter = {
        id: `new-${Date.now()}`, // Temporary ID until page refresh
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        engine_cc: parseInt(formData.get('engine_cc') as string) || 125,
        daily_price: addDailyPrice,
        weekly_price: addWeeklyPrice || null,
        monthly_price: addMonthlyPrice || null,
        deposit_amount: parseInt(formData.get('deposit_amount') as string) || 1000,
        number_plate: formData.get('number_plate') as string || null,
        main_image: mainImage || null,
        is_active: true,
        image_url: null
      }
      
      // Add to UI after server success
      setScooters(prev => [newScooter, ...prev])
      showToast.success('Scooter Added', 'New scooter has been added to your fleet')
      handleClose()
    } catch (error) {
      console.error('Failed to add scooter:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      showToast.error('Add Failed', errorMessage)
    } finally {
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
              size="lg"
              className="rounded-xl bg-orange-600 hover:bg-orange-700 shadow-md"
            >
              <Plus className="w-6 h-6" />
              <span className="">{t.addScooter}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {scooters.length === 0 ? (
            <Card className="border-dashed col-span-2 lg:col-span-3">
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
                  editScooter: t.editScooter,
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
            <Drawer.Title className="sr-only">{t.editScooter}</Drawer.Title>
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
                    <select
                      name="engine_cc"
                      id="engine_cc"
                      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                      defaultValue={selectedScooter.engine_cc}
                      required
                    >
                      <option value="50">50cc</option>
                      <option value="110">110cc</option>
                      <option value="125">125cc</option>
                      <option value="150">150cc</option>
                      <option value="160">160cc</option>
                      <option value="200">200cc</option>
                      <option value="250">250cc</option>
                      <option value="300">300cc</option>
                    </select>
                  </div>

                  <PricingInput
                    dailyPrice={dailyPrice}
                    weeklyPrice={weeklyPrice}
                    monthlyPrice={monthlyPrice}
                    onDailyChange={setDailyPrice}
                    onWeeklyChange={setWeeklyPrice}
                    onMonthlyChange={setMonthlyPrice}
                  />

                  <div className="grid grid-cols-2 gap-3">
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
                      className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {t.saveChanges}
                        </>
                      )}
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
            <Drawer.Title className="sr-only">{t.addNewScooter}</Drawer.Title>
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
                  <select
                    name="engine_cc"
                    id="add-engine_cc"
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                    defaultValue="125"
                    required
                  >
                    <option value="50">50cc</option>
                    <option value="110">110cc</option>
                    <option value="125">125cc</option>
                    <option value="150">150cc</option>
                    <option value="160">160cc</option>
                    <option value="200">200cc</option>
                    <option value="250">250cc</option>
                    <option value="300">300cc</option>
                  </select>
                </div>

                <PricingInput
                  dailyPrice={addDailyPrice}
                  weeklyPrice={addWeeklyPrice}
                  monthlyPrice={addMonthlyPrice}
                  onDailyChange={setAddDailyPrice}
                  onWeeklyChange={setAddWeeklyPrice}
                  onMonthlyChange={setAddMonthlyPrice}
                />

                <div className="grid grid-cols-2 gap-3">
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
                    className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {t.addToFleet}
                      </>
                    )}
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
