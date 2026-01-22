'use client'

import { useState } from 'react'
import { format, eachDayOfInterval, parseISO } from 'date-fns'
import { Drawer } from 'vaul'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { toggleAvailabilityAction } from '@/app/actions/availability'
import { Plus, Calendar, Loader2 } from 'lucide-react'

type Scooter = {
  id: string
  brand: string
  model: string
  number_plate?: string | null
}

type BulkBlockingDrawerProps = {
  scooters: Scooter[]
  onBlockingComplete?: () => void
}

export function BulkBlockingDrawer({ scooters, onBlockingComplete }: BulkBlockingDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScooterId, setSelectedScooterId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedScooterId || !startDate || !endDate) {
      showToast.error('Missing Fields', 'Please select scooter and date range')
      return
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (start > end) {
      showToast.error('Invalid Range', 'Start date must be before end date')
      return
    }

    setIsSubmitting(true)

    try {
      // Get all days in the range
      const daysToBlock = eachDayOfInterval({ start, end })
      
      // Block each day
      const promises = daysToBlock.map(day => 
        toggleAvailabilityAction(selectedScooterId, format(day, 'yyyy-MM-dd'), false)
      )

      await Promise.all(promises)

      const scooter = scooters.find(s => s.id === selectedScooterId)
      showToast.success(
        'Period Blocked',
        `${daysToBlock.length} days blocked for ${scooter?.model}`
      )

      // Reset form
      setSelectedScooterId('')
      setStartDate('')
      setEndDate('')
      setIsOpen(false)
      
      // Trigger calendar refresh
      onBlockingComplete?.()
    } catch (error) {
      console.error('Failed to block period:', error)
      showToast.error('Failed', 'Could not block the date range')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-orange-600 hover:bg-orange-700 shadow-md"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Booking
      </Button>

      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] max-h-[75dvh] fixed bottom-0 left-0 right-0 z-50">
            <Drawer.Title className="sr-only">Block Scooter Period</Drawer.Title>
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mt-4 mb-6" />

            <div className="flex items-center gap-4 px-6 pb-4 border-b">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Block Period</h2>
                <p className="text-gray-500 text-sm">Block a scooter for a date range</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 max-h-[calc(75dvh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6 pb-6">
                {/* Scooter Selection */}
                <div className="space-y-2">
                  <label htmlFor="scooter" className="text-sm font-bold text-gray-900">
                    Scooter
                  </label>
                  <select
                    id="scooter"
                    value={selectedScooterId}
                    onChange={(e) => setSelectedScooterId(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all font-medium text-gray-900"
                    required
                  >
                    <option value="">Select a scooter...</option>
                    {scooters.map(scooter => (
                      <option key={scooter.id} value={scooter.id}>
                        {scooter.brand} {scooter.model}
                        {scooter.number_plate ? ` (${scooter.number_plate})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-bold text-gray-900">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-bold text-gray-900">
                      End Date
                    </label>
                    <Input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Summary */}
                {startDate && endDate && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-bold">
                        {eachDayOfInterval({ 
                          start: parseISO(startDate), 
                          end: parseISO(endDate) 
                        }).length}
                      </span>
                      {' '}days will be blocked
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="sticky bottom-0 pt-4 pb-2 bg-white">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 text-base font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Blocking...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        Block Period
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
