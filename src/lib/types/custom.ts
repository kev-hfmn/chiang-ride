export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address?: string;
  city: string;
  location_lat?: number;
  location_lng?: number;
  is_verified: boolean;
  image_url?: string;
  deposit_amount?: number;
  deposit_policy_text?: string;
}

export interface Scooter {
  id: string;
  shop_id: string;
  model: string;
  brand: string;
  engine_cc: number;
  daily_price: number;
  weekly_price?: number;
  monthly_price?: number;
  deposit_amount: number;
  is_active: boolean;
  image_url?: string;
}

export type BookingStatus =
  | "requested"
  | "pending"
  | "confirmed" // Accepted, waiting for pickup
  | "active"    // Rental started / Currently on the road
  | "completed"
  | "cancelled"
  | "rejected"
  | "maintenance";


export interface Booking {
  id: string;
  scooter_id: string;
  shop_id: string;
  renter_id?: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status: BookingStatus;
  total_price: number;
  total_days?: number;
  customer_name?: string;
  customer_contact?: string;
  created_at: string;
  scooters?: Scooter; // For joined queries
}

export interface Review {
  id: string;
  shop_id: string;
  booking_id?: string;
  reviewer_name: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

export interface AvailabilityDay {
  id?: string;
  scooter_id: string;
  day: string; // ISO date string (YYYY-MM-DD)
  is_available: boolean;
  note?: string;
}

export interface ScooterWithShop extends Scooter {
  shops?: Shop;
}

export interface ScooterWithAvailability extends Scooter {
  availability?: AvailabilityDay[];
  bookings?: Booking[];
  blockedDates?: AvailabilityDay[];
}

// Icon component type for navigation items
export type IconComponent = React.ComponentType<{ className?: string }>
