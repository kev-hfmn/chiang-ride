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
  const { data } = await (await supabase)
    .from('scooters')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
  return data
}
