-- バンド / ライブセットリスト（名前を含むため閲覧はメンバーのみ）
-- Supabase SQL Editor で実行するか、CLI で適用してください。

create extension if not exists "pgcrypto";

-- 閲覧・編集を許可するログインユーザ（auth.users.id）
create table public.band_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.band_members enable row level security;

create policy "band_members_select_own"
  on public.band_members for select
  using (auth.uid() = user_id);

-- 新規メンバーはダッシュボードの SQL から追加:
-- insert into public.band_members (user_id)
--   select id from auth.users where email = 'you@example.com';

-- 1行 = スプレッドシート「一覧」の1行（1演奏エントリ）
create table public.live_setlist_entries (
  id uuid primary key default gen_random_uuid(),
  performance_date date not null,
  live_name text not null,
  copy_from text,
  video_url text,
  members jsonb not null default '{}'::jsonb,
  songs text[] not null default array[]::text[],
  my_parts text[] not null default array[]::text[],
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create index live_setlist_entries_date_live_idx
  on public.live_setlist_entries (performance_date desc, live_name);

create index live_setlist_entries_live_name_idx
  on public.live_setlist_entries using gin (to_tsvector('simple', live_name));

alter table public.live_setlist_entries enable row level security;

create policy "entries_select_band"
  on public.live_setlist_entries for select
  using (
    exists (
      select 1 from public.band_members m
      where m.user_id = auth.uid()
    )
  );

create policy "entries_insert_band"
  on public.live_setlist_entries for insert
  with check (
    exists (
      select 1 from public.band_members m
      where m.user_id = auth.uid()
    )
  );

create policy "entries_update_band"
  on public.live_setlist_entries for update
  using (
    exists (
      select 1 from public.band_members m
      where m.user_id = auth.uid()
    )
  );

create policy "entries_delete_band"
  on public.live_setlist_entries for delete
  using (
    exists (
      select 1 from public.band_members m
      where m.user_id = auth.uid()
    )
  );
