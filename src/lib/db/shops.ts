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

export async function getScooters(shopId: string) {
  const supabase = createClient()
  const { data: scooters } = await (await supabase)
    .from('scooters')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)

  if (!scooters || scooters.length === 0) return []

  const scooterIds = scooters.map(s => s.id)

  const { data: bookings } = await (await supabase)
    .from('bookings')
    .select('scooter_id, start_date, end_date, status')
    .in('scooter_id', scooterIds)
    .neq('status', 'cancelled')

  const { data: blocked } = await (await supabase)
    .from('availability_days')
    .select('scooter_id, day')
    .in('scooter_id', scooterIds)
    .eq('is_available', false)

  return scooters.map(scooter => ({
    ...scooter,
    bookings: bookings?.filter(b => b.scooter_id === scooter.id).map(b => ({
      start: new Date(b.start_date),
      end: new Date(b.end_date)
    })) || [],
    unavailableDates: blocked?.filter(b => b.scooter_id === scooter.id).map(b => new Date(b.day)) || []
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
