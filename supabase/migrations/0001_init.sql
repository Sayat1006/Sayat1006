-- S-AI — Stage 3 schema
-- Run this once against your Supabase Postgres database (SQL Editor,
-- or `supabase db push` / `psql` with the migrations CLI). Safe to re-run:
-- every statement is guarded with IF NOT EXISTS / OR REPLACE where possible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
--
-- S-AI authenticates with NextAuth's Credentials provider, not Supabase Auth,
-- so it keeps its own users table (email + password hash) rather than relying
-- on the built-in `auth.users`. Nothing outside server-side code should ever
-- read this table directly — see the RLS section at the bottom.
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  subject text not null default '',
  school text not null default '',
  -- "Сыныптары" (grades taught) from the Stage 2 profile UI. Not in the
  -- minimal column list in the spec, added so the existing profile form has
  -- somewhere real to persist this field instead of dropping it silently.
  grades text[] not null default '{}',
  language text not null default 'Қазақша',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  language text not null default 'Қазақша',
  notifications jsonb not null default '{"product": true, "tips": true, "marketing": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_settings_user_id_idx on public.user_settings (user_id);

-- ---------------------------------------------------------------------------
-- materials
-- ---------------------------------------------------------------------------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  type text not null check (type in ('qmj', 'presentation', 'test', 'bzb', 'tzb', 'worksheet', 'scenario')),
  subject text not null default '',
  grade text not null default '',
  content jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists materials_user_id_idx on public.materials (user_id);
create index if not exists materials_user_id_created_at_idx on public.materials (user_id, created_at desc);
create index if not exists materials_user_id_type_idx on public.materials (user_id, type);

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  material_id uuid not null references public.materials (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, material_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

-- ---------------------------------------------------------------------------
-- token_transactions (ledger — balance is always derived by summing amount)
-- ---------------------------------------------------------------------------
create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (type in ('generation', 'purchase', 'refund', 'bonus')),
  amount integer not null check (amount <> 0),
  description text not null default '',
  reference_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists token_transactions_user_id_idx on public.token_transactions (user_id);
create index if not exists token_transactions_user_id_created_at_idx
  on public.token_transactions (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.users;
create trigger set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.user_settings;
create trigger set_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.materials;
create trigger set_updated_at before update on public.materials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New-user bootstrap: profile row, settings row, and the +50 S-Token
-- signup bonus are created atomically by the database itself the moment a
-- row is inserted into `users` — the application never has to (and cannot
-- forget to) grant the bonus itself.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email);

  insert into public.user_settings (user_id)
  values (new.id);

  insert into public.token_transactions (user_id, type, amount, description)
  values (new.id, 'bonus', 50, 'Тіркелу бонусы');

  return new;
end;
$$;

drop trigger if exists on_user_created on public.users;
create trigger on_user_created after insert on public.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- consume_tokens / refund_tokens
--
-- Single round-trip, atomic ledger operations. Running the "is there enough
-- balance" check and the debiting insert inside one function call (instead
-- of two separate requests from the app server) closes the race window
-- where two concurrent generations could both pass a balance check before
-- either has inserted its debit row and push the balance negative.
-- ---------------------------------------------------------------------------
create or replace function public.get_token_balance(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(amount), 0)::integer
  from public.token_transactions
  where user_id = p_user_id;
$$;

create or replace function public.consume_tokens(
  p_user_id uuid,
  p_amount integer,
  p_description text,
  p_reference_id uuid default null
)
returns table (success boolean, balance integer, transaction_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
  new_id uuid;
begin
  if p_amount <= 0 then
    raise exception 'p_amount must be positive';
  end if;

  -- Serialize concurrent debits for the same user for the rest of this
  -- transaction (released automatically on commit/rollback), since an
  -- aggregate SUM query cannot itself be the target of SELECT ... FOR UPDATE.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select coalesce(sum(amount), 0) into current_balance
  from public.token_transactions
  where user_id = p_user_id;

  if current_balance < p_amount then
    return query select false, current_balance, null::uuid;
    return;
  end if;

  insert into public.token_transactions (user_id, type, amount, description, reference_id)
  values (p_user_id, 'generation', -p_amount, p_description, p_reference_id)
  returning id into new_id;

  return query select true, current_balance - p_amount, new_id;
end;
$$;

create or replace function public.refund_tokens(
  p_user_id uuid,
  p_amount integer,
  p_description text,
  p_reference_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'p_amount must be positive';
  end if;

  insert into public.token_transactions (user_id, type, amount, description, reference_id)
  values (p_user_id, 'refund', p_amount, p_description, p_reference_id);

  select coalesce(sum(amount), 0) into new_balance
  from public.token_transactions
  where user_id = p_user_id;

  return new_balance;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- S-AI's app server talks to Postgres with the service-role key (which
-- bypasses RLS by design) and always scopes queries to the session's own
-- user_id in application code — that is this app's primary access-control
-- boundary. The policies below are the defense-in-depth layer: they make
-- sure that if a request ever reaches these tables through the anon/
-- authenticated Postgres roles (e.g. the public Supabase API with the anon
-- key), it can still only ever see or touch that same caller's own rows,
-- and can never insert/alter a token_transaction at all.
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
-- Intentionally no policies: the users table (holding password hashes) is
-- only ever touched by the service role, which bypasses RLS entirely.

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.user_settings enable row level security;
create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.materials enable row level security;
create policy "materials_select_own" on public.materials
  for select using (auth.uid() = user_id);
create policy "materials_insert_own" on public.materials
  for insert with check (auth.uid() = user_id);
create policy "materials_update_own" on public.materials
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "materials_delete_own" on public.materials
  for delete using (auth.uid() = user_id);

alter table public.favorites enable row level security;
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

alter table public.token_transactions enable row level security;
create policy "token_transactions_select_own" on public.token_transactions
  for select using (auth.uid() = user_id);
-- No insert/update/delete policy for anon/authenticated: token transactions
-- can only ever be written by the service role (server-side consumeTokens /
-- refundTokens / the handle_new_user trigger), never by a client directly.
