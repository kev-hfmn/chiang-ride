'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminShop } from '@/lib/db/admin'
import { logger } from '@/lib/utils/logger'

/**
 * Updates shop settings including location, description, and deposit policy.
 * Verifies shop ownership before allowing updates.
 * 
 * @param formData - Form data containing shop settings
 * @throws Error if shop not found or user not authorized
 */
export async function updateShopSettingsAction(formData: FormData) {
    // Verify shop ownership (works for both auth and demo mode)
    const shop = await getAdminShop()
    if (!shop) {
        throw new Error('Shop not found')
    }

    const shopId = formData.get('shop_id') as string

    // Ensure the user can only update their own shop
    if (shopId !== shop.id) {
        throw new Error('Not authorized to update this shop')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const locationLat = formData.get('location_lat') as string
    const locationLng = formData.get('location_lng') as string
    const depositAmount = parseInt(formData.get('deposit_amount') as string) || 1000
    const depositPolicy = formData.get('deposit_policy_text') as string

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('shops')
        .update({
            name,
            description,
            address,
            city,
            location_lat: locationLat ? parseFloat(locationLat) : null,
            location_lng: locationLng ? parseFloat(locationLng) : null,
            deposit_amount: depositAmount,
            deposit_policy_text: depositPolicy
        })
        .eq('id', shop.id)

    if (error) {
        logger.error('Failed to update shop settings', error, { shopId: shop.id })
        throw new Error(`Failed to update settings: ${error.message}`)
    }

    revalidatePath('/admin/settings')
    revalidatePath('/admin')
    revalidatePath('/shops')
    redirect('/admin/settings')
}
