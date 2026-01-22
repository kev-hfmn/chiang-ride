import { Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScooterImage } from '@/components/scooter-image'
import { Button } from '@/components/ui/button'

interface ScooterCardProps {
  scooter: {
    id: string
    brand: string
    model: string
    engine_cc: number
    daily_price: number
    weekly_price?: number | null
    monthly_price?: number | null
    deposit_amount: number | null
    is_active: boolean
    image_url?: string | null
    main_image?: string | null
  }
  isAdmin?: boolean
  onEdit?: () => void
  translations?: {
    deposit?: string
    editScooter?: string
  }
}

export function ScooterCard({ scooter, isAdmin = false, onEdit, translations }: ScooterCardProps) {
  return (
    <Card className={`overflow-hidden ${isAdmin ? 'hover:shadow-lg cursor-pointer' : ''} transition-shadow duration-200 group relative`}>
      <CardContent className="p-0">
        {/* Scooter Image */}
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          <ScooterImage
            brand={scooter.brand}
            model={scooter.model}
            scooterId={scooter.id}
            imageUrl={scooter.image_url || scooter.main_image || undefined}
            fill={true}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Active Status Badge */}
          <div className="absolute top-2 left-2">
            <div className={`w-3 h-3 rounded-full ${scooter.is_active ? 'bg-green-500' : 'bg-red-500'} shadow-md`} />
          </div>

          {/* Engine CC Badge */}
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs bg-white/90 backdrop-blur-sm shadow-sm">
            {scooter.engine_cc}cc
          </Badge>

                  </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg truncate">
              {scooter.model}
            </h3>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {scooter.brand}
            </p>
          </div>

          {scooter.deposit_amount && (
            <p className="text-xs text-gray-500">
              {translations?.deposit || 'Deposit'}: {scooter.deposit_amount}฿
            </p>
          )}

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500 font-medium">Daily</p>
                <p className="text-sm font-bold text-gray-900">{scooter.daily_price}฿</p>
              </div>
              {scooter.weekly_price && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Weekly</p>
                  <p className="text-sm font-bold text-gray-900">{scooter.weekly_price}฿</p>
                </div>
              )}
              {scooter.monthly_price && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Monthly</p>
                  <p className="text-sm font-bold text-gray-900">{scooter.monthly_price}฿</p>
                </div>
              )}
            </div>
            {isAdmin && onEdit && (
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit()
                }}
                className="w-full mt-2"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {translations?.editScooter || 'Edit Scooter'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
