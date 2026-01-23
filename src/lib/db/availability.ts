import { createClient } from '@/lib/supabase/client'
import { format, isWithinInterval, parseISO } from 'date-fns'

/**
 * Check if a scooter is available today
 * Checks both bookings and availability_days table
 */
export async function isScooterAvailableToday(scooterId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')
    
    // Check if there's a manual availability override for today
    const { data: availabilityOverride } = await supabase
      .from('availability_days')
      .select('is_available')
      .eq('scooter_id', scooterId)
      .eq('day', today)
      .single()
    
    // If there's a manual override, use it
    if (availabilityOverride) {
      return availabilityOverride.is_available
    }
    
    // Check if there are any bookings for today
    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('scooter_id', scooterId)
      .neq('status', 'cancelled')
    
    if (!bookings || bookings.length === 0) {
      return true // No bookings, so available
    }
    
    // Check if today falls within any booking range
    const todayDate = new Date()
    const isBooked = bookings.some(booking => {
      const startDate = parseISO(booking.start_date)
      const endDate = parseISO(booking.end_date)
      return isWithinInterval(todayDate, { start: startDate, end: endDate })
    })
    
    return !isBooked // Available if not booked
  } catch (error) {
    console.error('Error checking availability:', error)
    return true // Default to available on error
  }
}

/**
 * Get availability status for multiple scooters
 * More efficient than calling isScooterAvailableToday multiple times
 */
export async function getScootersAvailabilityToday(scooterIds: string[]): Promise<Map<string, boolean>> {
  try {
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')
    const availabilityMap = new Map<string, boolean>()
    
    // Initialize all as available
    scooterIds.forEach(id => availabilityMap.set(id, true))
    
    // Check manual availability overrides for today
    const { data: overrides } = await supabase
      .from('availability_days')
      .select('scooter_id, is_available')
      .in('scooter_id', scooterIds)
      .eq('day', today)
    
    // Apply overrides
    overrides?.forEach(override => {
      availabilityMap.set(override.scooter_id, override.is_available)
    })
    
    // Check bookings for today
    const { data: bookings } = await supabase
      .from('bookings')
      .select('scooter_id, start_date, end_date')
      .in('scooter_id', scooterIds)
      .neq('status', 'cancelled')
    
    if (bookings && bookings.length > 0) {
      const todayDate = new Date()
      
      bookings.forEach(booking => {
        const startDate = parseISO(booking.start_date)
        const endDate = parseISO(booking.end_date)
        
        // If today falls within booking range and no override exists, mark as unavailable
        if (isWithinInterval(todayDate, { start: startDate, end: endDate })) {
          // Only mark unavailable if there's no manual override
          if (!overrides?.some(o => o.scooter_id === booking.scooter_id)) {
            availabilityMap.set(booking.scooter_id, false)
          }
        }
      })
    }
    
    return availabilityMap
  } catch (error) {
    console.error('Error checking availability for multiple scooters:', error)
    // Return all as available on error
    const map = new Map<string, boolean>()
    scooterIds.forEach(id => map.set(id, true))
    return map
  }
}
