import { Settings } from 'lucide-react'
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
    deposit_amount: number | null
    is_active: boolean
    image_url?: string | null
    main_image?: string | null
  }
  isAdmin?: boolean
  onEdit?: () => void
  translations?: {
    deposit?: string
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

          {/* Admin Edit Button Overlay */}
          {isAdmin && onEdit && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit()
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full w-12 h-12 bg-white shadow-lg hover:bg-gray-50"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          )}
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

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {scooter.engine_cc}cc
            </Badge>
            {scooter.deposit_amount && (
              <span className="text-xs text-gray-500">
                {translations?.deposit || 'Deposit'}: {scooter.deposit_amount}฿
              </span>
            )}
          </div>

          <div className="flex items-end justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {scooter.daily_price}฿
              </span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
            {isAdmin && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit()
                }}
                className="shrink-0"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
