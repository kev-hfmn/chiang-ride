const { createClient } = require('@supabase/supabase-js');

// Should be run with: node seed.js
// MAKE SURE TO SET ENV VARS BEFORE RUNNING:
// NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node seed.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Start seeding...');

  // 1. Create a demo user auth is tricky without admin API on client, 
  // so we will assume the user has logged in once to create a 'renter' profile.
  // We will manually insert a 'shop_owner' profile if we know the ID, but for this script
  // we'll just create a dummy shop for a dummy owner if needed, but RLS prevents us from inserting
  // random owner_ids unless we are admin. Since we are using service_role key, we bypass RLS.

  // Let's create a verified shop for a "System Demo Shop"
  // We need a valid UUID for owner. We'll generate one or use a placeholder.
  // Ideally, sign up a user in the browser, get their ID, and use that.
  
  // For now, let's just insert a shop with a random UUID as owner (orphan shop, but visible)
  const ownerId = '00000000-0000-0000-0000-000000000000'; // Dummy ID

  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: ownerId,
      name: 'Chiang Mai Scooters Pro',
      description: 'The best scooters in Nimman area. Verified and trusted.',
      address: '123 Nimman Road',
      city: 'Chiang Mai',
      is_verified: true
    })
    .select()
    .single();

  if (shopError) {
    console.error('Error creating shop:', shopError);
  } else {
    console.log('Created Shop:', shop.name);

    // Create Scooters
    const { error: scooterError } = await supabase
      .from('scooters')
      .insert([
        {
          shop_id: shop.id,
          model: 'Honda Click 125i',
          brand: 'Honda',
          engine_cc: 125,
          daily_price: 250,
          weekly_price: 1500,
          monthly_price: 3500,
          deposit_amount: 1000,
          is_active: true
        },
        {
          shop_id: shop.id,
          model: 'Yamaha Grand Filano',
          brand: 'Yamaha',
          engine_cc: 125,
          daily_price: 300,
          weekly_price: 1800,
          monthly_price: 4500,
          deposit_amount: 1000,
          is_active: true
        },
        {
          shop_id: shop.id,
          model: 'Honda PCX 160',
          brand: 'Honda',
          engine_cc: 160,
          daily_price: 500,
          weekly_price: 3000,
          monthly_price: 8000,
          deposit_amount: 3000,
          is_active: true
        }
      ]);

    if (scooterError) console.error('Error creating scooters:', scooterError);
    else console.log('Created 3 scooters.');
  }

  console.log('Seeding complete.');
}

seed();
