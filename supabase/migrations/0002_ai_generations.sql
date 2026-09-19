-- S-AI — Stage 4 schema addition: AI generation logging.
-- Run after 0001_init.sql. Safe to re-run.

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (
    type in ('qmj', 'test', 'bzb', 'tzb', 'presentation', 'worksheet', 'scenario', 'assistant')
  ),
  model text not null,
  status text not null check (status in ('success', 'failed')),
  token_cost integer not null default 0,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  -- Non-sensitive shape only (subject/grade/topic/language, error code, etc.) —
  -- never store prompts, raw AI output, or anything containing personal data
  -- beyond what's already in materials.
  input_metadata jsonb not null default '{}'::jsonb,
  output_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_generations_user_id_idx on public.ai_generations (user_id);
create index if not exists ai_generations_user_id_created_at_idx
  on public.ai_generations (user_id, created_at desc);
create index if not exists ai_generations_type_idx on public.ai_generations (type);

-- RLS: same pattern as token_transactions — users may read their own
-- generation history (for future analytics UI), but only the service role
-- (server-side logAIGeneration()) may ever write a row. No insert/update/
-- delete policy is granted to anon/authenticated on purpose.
alter table public.ai_generations enable row level security;

create policy "ai_generations_select_own" on public.ai_generations
  for select using (auth.uid() = user_id);
