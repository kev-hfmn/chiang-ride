'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'


export async function updateBookingStatusAction(formData: FormData) {
    const supabase = createAdminClient()
    
    const bookingId = formData.get('booking_id') as string
    const status = formData.get('status') as string

    if (!bookingId || !status) {
        throw new Error('Invalid Data')
    }

    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)

        if (error) throw error
        
        revalidatePath('/app/shop-admin')
        revalidatePath('/app/shop-admin/bookings')
        revalidatePath('/app/bookings') // Renter view
    } catch (error) {
        console.error('Error updating booking:', error)
        throw new Error('Failed to update booking')
    }
}

export async function startRentalAction(bookingId: string) {
    const supabase = createAdminClient()
    
    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'active' }) // Active now means "Started"
            .eq('id', bookingId)

        if (error) throw error
        
        revalidatePath('/app/shop-admin')
        revalidatePath('/app/shop-admin/bookings')
        revalidatePath('/app/bookings')
        
        return { success: true }
    } catch (error) {
        console.error('Error starting rental:', error)
        return { success: false, error: 'Failed to start rental' }
    }
}

