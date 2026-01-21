import { createClient } from '@/lib/supabase/server'

export async function getShop(id: string) {
  const supabase = createClient()
  const { data } = await (await supabase)
    .from('shops')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

/**
 * Fetches all scooters for a shop with their availability data.
 * Optimized to eliminate N+1 query pattern by fetching all related data in parallel.
 * 
 * @param shopId - The shop ID to fetch scooters for
 * @returns Array of scooters with availability, bookings, and blocked dates
 */
export async function getScooters(shopId: string) {
  const supabase = createClient()
  const { data: scooters } = await (await supabase)
    .from('scooters')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)

  if (!scooters || scooters.length === 0) return []

  const scooterIds = scooters.map(s => s.id)

  // Fetch all related data in parallel
  const [bookingsResult, blockedResult, availabilityResult] = await Promise.all([
    (await supabase)
      .from('bookings')
      .select('scooter_id, start_date, end_date, status')
      .in('scooter_id', scooterIds)
      .neq('status', 'cancelled'),
    (await supabase)
      .from('availability_days')
      .select('scooter_id, day')
      .in('scooter_id', scooterIds)
      .eq('is_available', false),
    (await supabase)
      .from('availability_days')
      .select('*')
      .in('scooter_id', scooterIds)
  ])

  const bookings = bookingsResult.data
  const blocked = blockedResult.data
  const availability = availabilityResult.data

  // Build Maps for O(1) lookups instead of O(n) filter operations (js-index-maps)
  const bookingsMap = new Map<string, Array<{ start: Date; end: Date }>>()
  bookings?.forEach(b => {
    if (!bookingsMap.has(b.scooter_id)) bookingsMap.set(b.scooter_id, [])
    bookingsMap.get(b.scooter_id)!.push({
      start: new Date(b.start_date),
      end: new Date(b.end_date)
    })
  })

  const blockedMap = new Map<string, Date[]>()
  blocked?.forEach(b => {
    if (!blockedMap.has(b.scooter_id)) blockedMap.set(b.scooter_id, [])
    blockedMap.get(b.scooter_id)!.push(new Date(b.day))
  })

  const availabilityMap = new Map<string, any[]>()
  availability?.forEach(a => {
    if (!availabilityMap.has(a.scooter_id)) availabilityMap.set(a.scooter_id, [])
    availabilityMap.get(a.scooter_id)!.push(a)
  })

  return scooters.map(scooter => ({
    ...scooter,
    bookings: bookingsMap.get(scooter.id) || [],
    unavailableDates: blockedMap.get(scooter.id) || [],
    availability: availabilityMap.get(scooter.id) || []
  }))
}

export async function getScooter(id: string) {
  const supabase = createClient()
  const { data } = await (await supabase)
    .from('scooters')
    .select(`
      *,
      shops (
        id,
        name,
        address,
        city,
        is_verified,
        deposit_policy_text
      )
    `)
    .eq('id', id)
    .single()
  return data
}

export async function getScooterAvailability(scooterId: string) {
  const supabase = createClient()
  const { data } = await (await supabase)
    .from('availability_days')
    .select('*')
    .eq('scooter_id', scooterId)
  return data || []
}

export async function getFeaturedScooters(limit = 6) {
  const supabase = createClient()
  const { data } = await (await supabase)
    .from('scooters')
    .select(`
      *,
      shops (
        id,
        name,
        address,
        city,
        is_verified
      )
    `)
    .eq('is_active', true)
    .limit(limit)
  return data || []
}
