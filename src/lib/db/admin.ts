import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shop, Scooter, Booking } from '@/lib/types/custom'

export async function getAdminShop() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Return the user's shop
    const { data } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .single()
    return data as Shop
  } else {
    // DEMO MODE: Use admin client to bypass RLS and return the Demo Shop
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('shops')
      .select('*')
      .eq('name', 'Chiang Mai Scooters')
      .single()

    if (error) {
      console.error('Error fetching demo shop:', error)
      return null
    }
    return data as Shop
  }
}

export async function getAdminInventory(shopId: string) {
  // Use admin client to bypass RLS for demo mode
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('scooters')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inventory:', error)
    return []
  }

  return (data || []) as Scooter[]
}

export async function getAdminBookings(shopId: string) {
  // Use admin client to bypass RLS for demo mode
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('bookings')
    .select(`
      *,
      scooters (
        model,
        brand
      )
    `)
    .eq('shop_id', shopId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error.message, error.details, error.hint)
    return []
  }

  return (data || []) as Booking[]
}
