-- Live a Spartan Life — initial schema
-- Run with: supabase db push  (or paste into the SQL editor)

-- ---------------------------------------------------------------------------
-- subscribers: everyone who asked for the Starter or the newsletter
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text not null default 'homepage',
  starter_requested_at timestamptz,
  newsletter_opt_in boolean not null default true,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, carrying subscription state
-- ---------------------------------------------------------------------------
create type public.subscription_status as enum (
  'none', 'trialing', 'active', 'past_due', 'canceled', 'incomplete'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status public.subscription_status not null default 'none',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_stripe_customer_idx on public.profiles (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- Keep updated_at honest
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscribers_touch_updated_at on public.subscribers;
create trigger subscribers_touch_updated_at
  before update on public.subscribers
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Create a profile whenever a user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row level security
-- Subscribers is written only by the service role (route handlers), never by
-- the browser. Profiles are readable and editable by their owner only.
-- ---------------------------------------------------------------------------
alter table public.subscribers enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "profiles are viewable by owner" on public.profiles;
create policy "profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles are updatable by owner" on public.profiles;
create policy "profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No policies on subscribers: with RLS on and no policy, anon and authenticated
-- clients get nothing. The service-role key used by the route handlers bypasses
-- RLS by design.

-- ---------------------------------------------------------------------------
-- Convenience view for the member gate
-- ---------------------------------------------------------------------------
create or replace view public.active_members
with (security_invoker = true)
as
select id, email, first_name, current_period_end
from public.profiles
where subscription_status in ('active', 'trialing');
