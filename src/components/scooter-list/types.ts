export interface ScooterWithShop {
  id: string;
  brand: string;
  model: string;
  engine_cc: number;
  daily_price: number;
  image_url?: string;
  shops?: {
    id: string;
    name: string;
    address?: string;
    city?: string;
  };
}
