-- Seed Data for Demo Mode

DO $$
DECLARE
  demo_owner_id uuid;
  demo_shop_id uuid;
  scooter_honda_click_id uuid;
  scooter_scoopy_id uuid;
  scooter_xmax_id uuid;
BEGIN
  -- 1. Create Demo Owner Profile (if not exists)
  -- Use a fixed UUID for reliability or check existence
  -- We'll try to find or create.
  
  -- Check if already exists to avoid duplicates on re-runs
  SELECT id INTO demo_owner_id FROM profiles WHERE full_name = 'Demo Shop Owner' LIMIT 1;
  
  IF demo_owner_id IS NULL THEN
    -- We need a user in auth.users ideally, but for now we are just inserting into profiles
    -- Note: RLS policies often check auth.uid(), so for true interactions we might need a real auth user.
    -- However, for the "No Login" demo, we will likely bypass RLS on the server-side fetching 
    -- or simulate an authenticated session. 
    -- For now, let's insert a profile with a random UUID. 
    -- (In a real Supabase setup, you can't easily insert into auth.users via SQL without admin rights, 
    -- but we can insert into profiles if we disable triggers or just let it be constraints).
    -- Wait, `id` references `auth.users`. I cannot insert into profiles if the user doesn't exist in auth.users constraint-wise.
    -- BUT, this is a demo. 
    -- Workaround: I will rely on the fact that I might not be able to insert into profiles if FK constraint exists.
    -- Let's check constraints. `profiles.id references auth.users`.
    -- So I MUST create an auth user or remove the constraint.
    -- Removing constraint is bad.
    -- ALTERNATIVELY: I will just assume there is at least one user or I can create a "fake" user if I have access to auth schema.
    -- Usually `auth` schema is protected.
    
    -- NEW STRATEGY for Demo: 
    -- I will insert the SHOP and SCOOTERS.
    -- For the `owner_id`, I will query the `auth.users` table if I can, or use the current user if I am running this via SQL editor as a user.
    -- BUT, `supabase-chiang` MCP runs as Admin/Service Role usually?
    -- Let's try to find ANY user to be the owner. If none, we are stuck.
    -- Actually, I can insert into `auth.users` if I am superuser/service_role.
    
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'demo@chiangride.com', 'encrypted_pw', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Demo Shop Owner"}', now(), now(), '', '', '', '')
    RETURNING id INTO demo_owner_id;
    
    -- Profile trigger handles profile creation automatically?
    -- Let's check schema. Yes, `handle_new_user` on `auth.users` insert.
    -- So profile should be created automatically.
  END IF;

  -- 2. Create Demo Shop
  SELECT id INTO demo_shop_id FROM shops WHERE name = 'Chiang Mai Scooters' LIMIT 1;

  IF demo_shop_id IS NULL THEN
    INSERT INTO shops (owner_id, name, description, address, city, latitude, longitude, is_verified)
    VALUES (demo_owner_id, 'Chiang Mai Scooters', 'Friendly local shop with well-maintained bikes. Free helmet included!', '123 Nimman Road', 'Chiang Mai', 18.7961, 98.9687, true)
    RETURNING id INTO demo_shop_id;

    -- Add more demo shops for map variety
    INSERT INTO shops (owner_id, name, description, address, city, latitude, longitude, is_verified)
    VALUES
      (demo_owner_id, 'Old City Rentals', 'Located near Tha Phae Gate. Best rates for weekly rentals!', '45 Ratchadamnoen Rd', 'Chiang Mai', 18.7883, 98.9944, true),
      (demo_owner_id, 'Maya Bikes', 'Premium scooters near Maya Mall. Airport pickup available.', '55 Huay Kaew Rd', 'Chiang Mai', 18.8024, 98.9671, true),
      (demo_owner_id, 'Santitham Scooters', 'Budget-friendly options in the Santitham area.', '78 Santitham Rd', 'Chiang Mai', 18.8012, 98.9789, false);
  END IF;

  -- 3. Insert Scooters
  
  -- Honda Click
  INSERT INTO scooters (shop_id, model, brand, engine_cc, daily_price, weekly_price, monthly_price, deposit_amount, is_active)
  VALUES (demo_shop_id, 'Click 160', 'Honda', 160, 250, 1500, 3500, 1000, true)
  RETURNING id INTO scooter_honda_click_id;

  -- Honda Scoopy
  INSERT INTO scooters (shop_id, model, brand, engine_cc, daily_price, weekly_price, monthly_price, deposit_amount, is_active)
  VALUES (demo_shop_id, 'Scoopy i', 'Honda', 110, 200, 1200, 3000, 1000, true)
  RETURNING id INTO scooter_scoopy_id;

  -- Yamaha NMAX (Premium)
  INSERT INTO scooters (shop_id, model, brand, engine_cc, daily_price, weekly_price, monthly_price, deposit_amount, is_active)
  VALUES (demo_shop_id, 'NMAX 155', 'Yamaha', 155, 400, 2500, 6000, 2000, true)
  RETURNING id INTO scooter_xmax_id;

  -- Honda PCX
  INSERT INTO scooters (shop_id, model, brand, engine_cc, daily_price, weekly_price, monthly_price, deposit_amount, is_active)
  VALUES (demo_shop_id, 'PCX 160', 'Honda', 160, 450, 2800, 7000, 2000, true);

  -- Grand Filano
  INSERT INTO scooters (shop_id, model, brand, engine_cc, daily_price, weekly_price, monthly_price, deposit_amount, is_active)
  VALUES (demo_shop_id, 'Grand Filano', 'Yamaha', 125, 250, 1500, 3500, 1000, true);

  -- 4. Create Availability / Bookings
  -- Create a past completed booking for Honda Click
  INSERT INTO bookings (scooter_id, shop_id, renter_id, start_date, end_date, status, total_price, customer_name)
  VALUES (scooter_honda_click_id, demo_shop_id, NULL, CURRENT_DATE - 5, CURRENT_DATE - 1, 'completed', 1000, 'John Doe (Walk-in)');

  -- Create an active booking for Scoopy (Now)
  INSERT INTO bookings (scooter_id, shop_id, renter_id, start_date, end_date, status, total_price, customer_name)
  VALUES (scooter_scoopy_id, demo_shop_id, NULL, CURRENT_DATE - 2, CURRENT_DATE + 3, 'active', 1200, 'Sarah Smith');

  -- Create a future booking for XMAX
  INSERT INTO bookings (scooter_id, shop_id, renter_id, start_date, end_date, status, total_price, customer_name)
  VALUES (scooter_xmax_id, demo_shop_id, NULL, CURRENT_DATE + 5, CURRENT_DATE + 10, 'confirmed', 2000, 'Mike Johnson');

END $$;
