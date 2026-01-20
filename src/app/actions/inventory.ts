'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminShop } from '@/lib/db/admin'

export async function addScooterAction(formData: FormData) {
  // 1. Identify the Shop (this handles auth or demo fallback)
  const shop = await getAdminShop()
  if (!shop) {
    console.error('Shop not found. Make sure to run the seed script to create the demo shop.')
    throw new Error('Shop not found. Please run the database seed script first.')
  }

  // 2. Extract Data
  const model = formData.get('model') as string
  const brand = formData.get('brand') as string
  const engine_cc = parseInt(formData.get('engine_cc') as string) || 125
  const daily_price = parseInt(formData.get('daily_price') as string) || 250
  const deposit_amount = parseInt(formData.get('deposit_amount') as string) || 1000

  // 3. Create (using Admin Client to ensure success in Demo Mode)
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scooters')
    .insert({
      shop_id: shop.id,
      brand,
      model,
      engine_cc,
      daily_price,
      deposit_amount,
      is_active: true
    })

  if (error) {
    console.error('Create Scooter Error:', error)
    throw new Error(`Failed to add scooter: ${error.message}`)
  }

  // 4. Revalidate & Redirect
  revalidatePath('/app/shop-admin/inventory')
  revalidatePath('/app')
  redirect('/app/shop-admin/inventory')
}
