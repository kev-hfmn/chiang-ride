'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateShopSettingsAction(formData: FormData) {
    const supabase = createAdminClient()

    const shopId = formData.get('shop_id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const locationLat = formData.get('location_lat') as string
    const locationLng = formData.get('location_lng') as string
    const depositAmount = parseInt(formData.get('deposit_amount') as string) || 1000
    const depositPolicy = formData.get('deposit_policy_text') as string

    if (!shopId) {
        throw new Error('Shop ID required')
    }

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
        .eq('id', shopId)

    if (error) {
        console.error('Error updating shop settings:', error)
        throw new Error(`Failed to update settings: ${error.message}`)
    }

    revalidatePath('/app/shop-admin/settings')
    revalidatePath('/app/shop-admin')
    revalidatePath('/app/shops')
    redirect('/app/shop-admin/settings')
}
