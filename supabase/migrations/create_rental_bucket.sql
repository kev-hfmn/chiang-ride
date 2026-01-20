
insert into storage.buckets (id, name, public)
values ('rental-verification', 'rental-verification', true)
on conflict (id) do nothing;

-- Policy to allow public read access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'rental-verification' );

-- Policy to allow anyone to upload (for ease of use with the rental flow, 
-- ideally restricted to authenticated users or via a secure function)
-- For this demo/ MVP, we allow public inserts but verify in app logic.
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'rental-verification' );
