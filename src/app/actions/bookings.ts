'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { getAdminShop } from '@/lib/db/admin'
import { logger } from '@/lib/utils/logger'

/**
 * Updates the status of a booking with shop ownership verification.
 * Only allows shop owners to update bookings for their own shop.
 * 
 * @param formData - Form data containing booking_id and status
 * @throws Error if shop not found or booking not authorized
 */
export async function updateBookingStatusAction(formData: FormData) {
    const bookingId = formData.get('booking_id') as string
    const status = formData.get('status') as string

    if (!bookingId || !status) {
        throw new Error('Invalid Data')
    }

    // Verify shop ownership (works for both auth and demo mode)
    const shop = await getAdminShop()
    if (!shop) {
        throw new Error('Shop not found')
    }

    const supabase = createAdminClient()

    try {
        // Only update bookings belonging to this shop
        const { error, count } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)
            .eq('shop_id', shop.id)

        if (error) throw error
        if (count === 0) {
            throw new Error('Booking not found or not authorized')
        }
        
        revalidatePath('/admin')
        revalidatePath('/admin/bookings')
        revalidatePath('/bookings')
    } catch (error) {
        logger.error('Failed to update booking status', error, { bookingId, status })
        throw new Error('Failed to update booking')
    }
}

/**
 * Starts a rental by updating booking status to 'active'.
 * Called when shop owner confirms rental pickup.
 * 
 * @param bookingId - The booking ID to activate
 * @returns Success status with error message if failed
 */
export async function startRentalAction(bookingId: string) {
    const supabase = createAdminClient()
    
    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'active' }) // Active now means "Started"
            .eq('id', bookingId)

        if (error) throw error
        
        revalidatePath('/admin')
        revalidatePath('/admin/bookings')
        revalidatePath('/bookings')
        
        return { success: true }
    } catch (error) {
        logger.error('Failed to start rental', error, { bookingId })
        return { success: false, error: 'Failed to start rental' }
    }
}

