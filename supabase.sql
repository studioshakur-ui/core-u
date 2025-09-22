create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text check (role in ('capo','manager','direzione')) default 'capo',
  created_at timestamptz default now()
);
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role) values (new.id, new.email, 'capo');
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
alter table public.profiles enable row level security;
drop policy if exists "self read" on public.profiles;
create policy "self read" on public.profiles for select using (auth.uid()=id);
drop policy if exists "self update" on public.profiles;
create policy "self update" on public.profiles for update using (auth.uid()=id);
