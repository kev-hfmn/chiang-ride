import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shop, Scooter, Booking } from '@/lib/types/custom'
import { logger } from '@/lib/utils/logger'

/**
 * Gets the shop for the current user or demo shop in demo mode.
 * Uses admin client to bypass RLS when no authenticated user exists.
 * 
 * @returns Shop object or null if not found
 */
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
      logger.error('Failed to fetch demo shop', error)
      return null
    }
    return data as Shop
  }
}

/**
 * Fetches all scooters for a shop using admin client.
 * Bypasses RLS for demo mode functionality.
 * 
 * @param shopId - The shop ID to fetch inventory for
 * @returns Array of scooters ordered by creation date
 */
export async function getAdminInventory(shopId: string) {
  // Use admin client to bypass RLS for demo mode
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('scooters')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Failed to fetch inventory', error, { shopId })
    return []
  }

  return (data || []) as Scooter[]
}

/**
 * Fetches all bookings for a shop with scooter details.
 * Bypasses RLS for demo mode functionality.
 * 
 * @param shopId - The shop ID to fetch bookings for
 * @returns Array of bookings with joined scooter data
 */
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
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Failed to fetch bookings', error, { shopId })
    return []
  }

  return (data || []) as Booking[]
}
