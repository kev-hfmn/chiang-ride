'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Settings, Calendar } from 'lucide-react'
import { Drawer } from 'vaul'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScooterImage } from '@/components/scooter-image'
import { updateScooterAction } from '@/app/actions/inventory'

interface Scooter {
  id: string
  brand: string
  model: string
  engine_cc: number
  daily_price: number
  deposit_amount: number | null
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
    availableForRent: string
    saveChanges: string
  }
}

export function InventoryListWithDrawer({ scooters, translations: t }: InventoryListWithDrawerProps) {
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (scooter: Scooter) => {
    setSelectedScooter(scooter)
  }

  const handleClose = () => {
    setSelectedScooter(null)
  }

  const handleSubmit = async (formData: FormData) => {
    if (!selectedScooter) return
    
    setIsSubmitting(true)
    try {
      await updateScooterAction(selectedScooter.id, formData)
      handleClose()
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Failed to update scooter:', error)
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

            <Button asChild className="rounded-xl bg-orange-600 hover:bg-orange-700 shadow-md">
              <Link href="/admin/inventory/new">
                <Plus className="w-5 h-5" />
                <span className="">{t.addScooter}</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-2 overflow-hidden">
          {scooters.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-gray-500">
                {t.noScooters}
              </CardContent>
            </Card>
          ) : (
            scooters.map((scooter) => (
              <Card
                key={scooter.id}
                className="group hover:shadow-md transition-all overflow-hidden"
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden">
                    <ScooterImage
                      brand={scooter.brand}
                      model={scooter.model}
                      scooterId={scooter.id}
                      imageUrl={scooter.image_url || undefined}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${scooter.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">
                        {scooter.model}
                      </h3>
                      <span className="text-sm font-semibold text-gray-900 shrink-0">
                        {scooter.daily_price}฿
                        <span className="text-xs text-gray-500 font-normal">/day</span>
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        {scooter.engine_cc}cc
                      </Badge>
                      <span className="truncate">
                        {t.deposit}: {scooter.deposit_amount}฿
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleEdit(scooter)}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Drawer */}
      <Drawer.Root open={!!selectedScooter} onOpenChange={(open) => !open && handleClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mt-4 mb-6" />
            
            <div className="flex items-center gap-4 px-6 pb-4 border-b">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{t.editScooter}</h1>
                <p className="text-gray-500 text-sm">{t.updateDetails}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
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
    </>
  )
}
