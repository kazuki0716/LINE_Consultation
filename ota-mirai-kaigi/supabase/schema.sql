-- おおた未来カイギ 申込受付用のテーブルと関数
-- Supabase の SQL Editor にこのファイルの中身を貼り付けて「Run」すると準備が終わります。
-- 何度実行しても大丈夫です（既にある申込データは消えません）。

-- 申込者
create table if not exists public.ota_entries (
  id         bigint generated always as identity primary key,
  name       text        not null,
  kana       text        not null,
  email      text        not null unique,
  phone      text        not null default '',
  created_at timestamptz not null default now()
);

-- 設定（定員）。管理ページから変更する。空のときは Vercel の CAPACITY を使う
create table if not exists public.ota_settings (
  id       int primary key default 1 check (id = 1),
  capacity int check (capacity between 1 and 100000)
);
insert into public.ota_settings (id) values (1) on conflict (id) do nothing;

-- サーバー（Vercel の受付プログラム）以外からは読み書きできないようにする
alter table public.ota_entries enable row level security;
alter table public.ota_settings enable row level security;
revoke all on table public.ota_entries, public.ota_settings from anon, authenticated;

-- 重複チェック・定員チェック・登録を、ロックをかけて一度に行う（同時申込でも定員を超えない）
-- p_capacity は、管理ページで定員が設定されていないときに使う値
-- 戻り値: 1以上 = 登録後の人数、-1 = 満席、-2 = 登録済みのメールアドレス
create or replace function public.ota_register(
  p_name text, p_kana text, p_email text, p_phone text, p_capacity int
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n   int;
  cap int;
begin
  perform pg_advisory_xact_lock(hashtext('ota_entries'));
  if exists (select 1 from ota_entries where email = p_email) then
    return -2;
  end if;
  select coalesce((select capacity from ota_settings where id = 1), p_capacity) into cap;
  select count(*) into n from ota_entries;
  if n >= cap then
    return -1;
  end if;
  insert into ota_entries (name, kana, email, phone)
  values (p_name, p_kana, p_email, coalesce(p_phone, ''));
  return n + 1;
end;
$$;

-- 現在の定員と申込数
create or replace function public.ota_status(p_default int) returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'capacity', coalesce((select capacity from ota_settings where id = 1), p_default),
    'count', (select count(*)::int from ota_entries)
  )
$$;

-- 定員を変える（管理ページから）
create or replace function public.ota_set_capacity(p_capacity int) returns void
language sql
security definer
set search_path = public
as $$
  update ota_settings set capacity = p_capacity where id = 1
$$;

-- 申込を全件消して、受付番号を1からに戻す（管理ページから）
create or replace function public.ota_reset() returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext('ota_entries'));
  truncate table ota_entries restart identity;
end;
$$;

-- 申込数だけを返す（以前の版との互換用）
create or replace function public.ota_count() returns int
language sql
stable
security definer
set search_path = public
as $$ select count(*)::int from ota_entries $$;

-- 関数はサーバー（service_role）からだけ呼べるようにする
revoke execute on function public.ota_register(text, text, text, text, int) from public, anon, authenticated;
revoke execute on function public.ota_status(int) from public, anon, authenticated;
revoke execute on function public.ota_set_capacity(int) from public, anon, authenticated;
revoke execute on function public.ota_reset() from public, anon, authenticated;
revoke execute on function public.ota_count() from public, anon, authenticated;
grant execute on function public.ota_register(text, text, text, text, int) to service_role;
grant execute on function public.ota_status(int) to service_role;
grant execute on function public.ota_set_capacity(int) to service_role;
grant execute on function public.ota_reset() to service_role;
grant execute on function public.ota_count() to service_role;
grant select on table public.ota_entries to service_role;
