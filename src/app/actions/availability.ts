'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Toggle availability status for a specific scooter on a specific date
 * Creates or updates availability record in the database
 */
export async function toggleAvailabilityAction(
  scooterId: string,
  date: string, // YYYY-MM-DD format
  isAvailable: boolean
) {
  try {
    console.log(`Toggling availability for scooter ${scooterId} on ${date} to ${isAvailable}`)
    
    const supabase = createAdminClient()
    
    // Upsert availability record (insert or update)
    const { error } = await supabase
      .from('availability_days')
      .upsert(
        {
          scooter_id: scooterId,
          day: date,
          is_available: isAvailable
        },
        {
          onConflict: 'scooter_id,day'
        }
      )
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to save availability: ${error.message}`)
    }
    
    revalidatePath('/admin/calendar')
    revalidatePath(`/admin/scooters/${scooterId}`)
    
    return { success: true, message: `Availability ${isAvailable ? 'enabled' : 'disabled'} for ${date}` }
  } catch (error) {
    console.error('Failed to toggle availability:', error)
    throw new Error(`Failed to update availability: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
