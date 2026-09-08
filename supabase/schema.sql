-- BaniWise database schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> Run).
-- This file is a versioned snapshot for documentation purposes, not a
-- Supabase CLI migration.

-- Recurrence frequency shared by income and expenses
create type recurrence_frequency as enum ('one_time', 'weekly', 'monthly', 'yearly');

-- One row per user, holds app-specific data auth.users doesn't have
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Fixed, system-defined expense categories (not user-editable for now)
create table public.categories (
  id text primary key,
  name text not null
);

insert into public.categories (id, name) values
  ('rent', 'Rent & Housing'),
  ('groceries', 'Groceries'),
  ('transport', 'Transport'),
  ('utilities', 'Utilities'),
  ('health', 'Health'),
  ('entertainment', 'Entertainment'),
  ('subscriptions', 'Subscriptions'),
  ('other', 'Other');

-- Income definitions (one-time or recurring rule, not individual occurrences)
create table public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  amount numeric(10, 2) not null check (amount > 0),
  frequency recurrence_frequency not null,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create index income_user_id_idx on public.income (user_id);

-- Expense definitions (one-time or recurring rule, not individual occurrences)
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id text not null references public.categories (id),
  label text not null,
  amount numeric(10, 2) not null check (amount > 0),
  frequency recurrence_frequency not null,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index expenses_user_id_idx on public.expenses (user_id);
create index expenses_category_id_idx on public.expenses (category_id);

-- Expose tables to the Data API (grants only decide "can this role
-- reach the table at all" -- RLS below still decides "which rows")
grant select on table public.categories to anon, authenticated;
grant select, insert, update, delete on table public.income to authenticated;
grant select, insert, update, delete on table public.expenses to authenticated;
grant select, update on table public.profiles to authenticated;

-- Categories are shared reference data, safe to expose to everyone
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- profiles/income/expenses: RLS is already ON (project-level setting)
-- with ZERO policies -- fully locked until Phase 7 adds ownership rules.

-- Phase 6: automatically create a profile row when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Phase 7: row level security ownership policies

alter table public.profiles enable row level security;
alter table public.income enable row level security;
alter table public.expenses enable row level security;

-- profiles: users can view and edit only their own profile row
create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- income: users can fully manage only their own rows
create policy "Users can view their own income"
  on public.income for select
  using (user_id = auth.uid());

create policy "Users can insert their own income"
  on public.income for insert
  with check (user_id = auth.uid());

create policy "Users can update their own income"
  on public.income for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own income"
  on public.income for delete
  using (user_id = auth.uid());

-- expenses: same ownership pattern as income
create policy "Users can view their own expenses"
  on public.expenses for select
  using (user_id = auth.uid());

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (user_id = auth.uid());

create policy "Users can update their own expenses"
  on public.expenses for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (user_id = auth.uid());
