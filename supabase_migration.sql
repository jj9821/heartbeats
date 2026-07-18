-- Supabase Schema Initialization
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  avatar text,
  partner_id uuid references public.users(id) on delete set null,
  online boolean default false not null,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null,
  invite_code text unique not null,
  settings jsonb default '{"notificationsEnabled": true, "quietHoursEnabled": false, "quietHoursStart": "22:00", "quietHoursEnd": "07:00", "darkMode": "system", "nickname": ""}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create heartbeats table
create table public.heartbeats (
  id uuid default gen_random_uuid() primary key,
  sender uuid references public.users(id) on delete cascade not null,
  receiver uuid references public.users(id) on delete cascade not null,
  message text,
  seen boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create device_tokens table
create table public.device_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  token text unique not null,
  platform text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create performance indexes
create index users_invite_code_idx on public.users (invite_code);
create index heartbeats_sender_receiver_idx on public.heartbeats (sender, receiver, created_at desc);
create index heartbeats_receiver_sender_idx on public.heartbeats (receiver, sender, created_at desc);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.heartbeats enable row level security;
alter table public.device_tokens enable row level security;

-- RLS Policies for public.users
create policy "Allow users to read all profiles"
  on public.users for select
  using (true);

create policy "Allow users to update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Allow users to insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- RLS Policies for public.heartbeats
create policy "Allow users to insert heartbeats where they are the sender"
  on public.heartbeats for insert
  with check (auth.uid() = sender);

create policy "Allow users to read heartbeats they sent or received"
  on public.heartbeats for select
  using (auth.uid() = sender or auth.uid() = receiver);

-- RLS Policies for public.device_tokens
create policy "Allow users to manage their own device tokens"
  on public.device_tokens for all
  using (auth.uid() = user_id);

-- Enable Realtime for users and heartbeats
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.heartbeats;
