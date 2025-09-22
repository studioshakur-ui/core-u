-- Profiles table (role-based access)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text check (role in ('capo','manager','direzione')) default 'capo',
  created_at timestamp with time zone default now()
);

-- Keep email in sync
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role) values (new.id, new.email, 'capo');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "Profile is self" on public.profiles;
create policy "Profile is self"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Allow user to update own profile" on public.profiles;
create policy "Allow user to update own profile"
on public.profiles for update
using (auth.uid() = id);

-- Simple seed (optional):
-- update public.profiles set role = 'manager' where email = 'manager@example.com';
-- update public.profiles set role = 'direzione' where email = 'direzione@example.com';
