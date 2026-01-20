export interface Shop {
  id: string
  owner_id: string
  name: string
  description?: string
  address?: string
  city: string
  latitude?: number
  longitude?: number
  is_verified: boolean
  image_url?: string // Placeholder if we add images later
  deposit_amount?: number
  deposit_policy_text?: string
}

export interface Scooter {
  id: string
  shop_id: string
  model: string
  brand: string
  engine_cc: number
  daily_price: number
  weekly_price?: number
  monthly_price?: number
  deposit_amount: number
  is_active: boolean
  image_url?: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'maintenance'

export interface Booking {
  id: string
  scooter_id: string
  shop_id: string
  renter_id?: string
  start_date: string // ISO date string
  end_date: string // ISO date string
  status: BookingStatus
  total_price: number
  customer_name?: string
  customer_contact?: string
  created_at: string
  scooters?: Scooter // For joined queries
}
