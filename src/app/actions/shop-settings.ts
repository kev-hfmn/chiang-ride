'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateShopSettingsAction(formData: FormData) {
    const supabase = createAdminClient()
    
    const shopId = formData.get('shop_id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const depositAmount = parseInt(formData.get('deposit_amount') as string)
    const depositPolicy = formData.get('deposit_policy_text') as string

    if (!shopId) return { error: 'Shop ID required' }

    try {
        const { error } = await supabase
            .from('shops')
            .update({
                name,
                description,
                deposit_amount: depositAmount,
                deposit_policy_text: depositPolicy
            })
            .eq('id', shopId)

        if (error) throw error
        
        revalidatePath('/app/shop-admin/settings')
        revalidatePath('/app/shops/[id]', 'page')
    } catch (error) {
        console.error('Error updating shop settings:', error)
        return { error: 'Failed to update settings' }
    }

    redirect('/app/shop-admin')
}
