-- Ember: Initial Database Schema
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- USERS
-- =====================
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table users enable row level security;

create policy "Users can view their own profile"
  on users for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on users for insert with check (auth.uid() = id);

-- =====================
-- BABIES
-- =====================
create table if not exists babies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  image_url text,
  happiness integer default 80 check (happiness between 0 and 100),
  hunger integer default 80 check (hunger between 0 and 100),
  cleanliness integer default 80 check (cleanliness between 0 and 100),
  fun integer default 80 check (fun between 0 and 100),
  mode text not null check (mode in ('solo', 'partner')),
  sync_code text unique,
  created_at timestamptz default now(),
  last_action_at timestamptz default now()
);

alter table babies enable row level security;

create policy "Members can view their baby"
  on babies for select using (
    exists (
      select 1 from baby_members
      where baby_id = babies.id and user_id = auth.uid()
    )
  );

create policy "Members can update their baby"
  on babies for update using (
    exists (
      select 1 from baby_members
      where baby_id = babies.id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create babies"
  on babies for insert with check (auth.uid() is not null);

-- =====================
-- BABY MEMBERS
-- =====================
create table if not exists baby_members (
  id uuid primary key default uuid_generate_v4(),
  baby_id uuid not null references babies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('creator', 'partner')),
  joined_at timestamptz default now(),
  unique (baby_id, user_id)
);

alter table baby_members enable row level security;

create policy "Users can view memberships for their babies"
  on baby_members for select using (user_id = auth.uid());

create policy "Users can insert their own membership"
  on baby_members for insert with check (user_id = auth.uid());

-- =====================
-- ACTIONS
-- =====================
create table if not exists actions (
  id uuid primary key default uuid_generate_v4(),
  baby_id uuid not null references babies(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  action_type text not null check (action_type in ('feed', 'diaper', 'play')),
  performed_at timestamptz default now()
);

alter table actions enable row level security;

create policy "Members can view actions for their baby"
  on actions for select using (
    exists (
      select 1 from baby_members
      where baby_id = actions.baby_id and user_id = auth.uid()
    )
  );

create policy "Members can insert actions for their baby"
  on actions for insert with check (
    user_id = auth.uid() and
    exists (
      select 1 from baby_members
      where baby_id = actions.baby_id and user_id = auth.uid()
    )
  );

-- =====================
-- SUBSCRIPTIONS
-- =====================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'free' check (status in ('free', 'active', 'cancelled', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users can view their own subscription"
  on subscriptions for select using (user_id = auth.uid());

-- =====================
-- REAL-TIME
-- =====================
-- Enable real-time for babies and actions tables
alter publication supabase_realtime add table babies;
alter publication supabase_realtime add table actions;
