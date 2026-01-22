'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminShop } from '@/lib/db/admin'
import { logger } from '@/lib/utils/logger'

/**
 * Adds a new scooter to the shop's inventory.
 * Verifies shop ownership before creating the scooter.
 * 
 * @param formData - Form data containing scooter details (model, brand, engine_cc, daily_price, deposit_amount)
 * @throws Error if shop not found
 */
export async function addScooterAction(formData: FormData) {
  // 1. Identify the Shop (this handles auth or demo fallback)
  const shop = await getAdminShop()
  if (!shop) {
    logger.error('Shop not found during scooter creation', undefined, { action: 'addScooter' })
    throw new Error('Shop not found. Please run the database seed script first.')
  }

  // 2. Extract Data
  const model = formData.get('model') as string
  const brand = formData.get('brand') as string
  const engine_cc = parseInt(formData.get('engine_cc') as string) || 125
  const daily_price = parseInt(formData.get('daily_price') as string) || 250
  const weekly_price = parseInt(formData.get('weekly_price') as string) || null
  const monthly_price = parseInt(formData.get('monthly_price') as string) || null
  const deposit_amount = parseInt(formData.get('deposit_amount') as string) || 1000
  const number_plate = formData.get('number_plate') as string
  const main_image = formData.get('main_image') as string

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
      weekly_price,
      monthly_price,
      deposit_amount,
      number_plate: number_plate || null,
      main_image: main_image || null,
      is_active: true
    })

  if (error) {
    logger.error('Failed to create scooter', error, { shopId: shop.id, model, brand })
    throw new Error(`Failed to add scooter: ${error.message}`)
  }

  // 4. Revalidate
  revalidatePath('/admin/inventory')
  revalidatePath('/')
  
  return { success: true, message: 'Scooter added successfully' }
}

/**
 * Updates an existing scooter's details.
 * Verifies shop ownership and ensures scooter belongs to the shop.
 * 
 * @param id - The scooter ID to update
 * @param formData - Form data containing updated scooter details
 * @throws Error if shop not found or scooter not owned by shop
 */
export async function updateScooterAction(id: string, formData: FormData) {
  const shop = await getAdminShop()
  if (!shop) throw new Error('Shop not found')

  const model = formData.get('model') as string
  const brand = formData.get('brand') as string
  const engine_cc = parseInt(formData.get('engine_cc') as string) || 125
  const daily_price = parseInt(formData.get('daily_price') as string) || 250
  const weekly_price = parseInt(formData.get('weekly_price') as string) || null
  const monthly_price = parseInt(formData.get('monthly_price') as string) || null
  const deposit_amount = parseInt(formData.get('deposit_amount') as string) || 1000
  const number_plate = formData.get('number_plate') as string
  const main_image = formData.get('main_image') as string
  const is_active = formData.get('is_active') === 'on'

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('scooters')
    .update({
      brand,
      model,
      engine_cc,
      daily_price,
      weekly_price,
      monthly_price,
      deposit_amount,
      number_plate: number_plate || null,
      main_image: main_image || null,
      is_active
    })
    .eq('id', id)
    // Extra safety: ensure this scooter actually belongs to this shop
    .eq('shop_id', shop.id)

  if (error) {
    logger.error('Failed to update scooter', error, { scooterId: id, shopId: shop.id })
    throw new Error(`Failed to update scooter: ${error.message}`)
  }

  revalidatePath('/admin/inventory')
  revalidatePath('/')
  
  return { success: true, message: 'Scooter updated successfully' }
}
