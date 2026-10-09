-- 以前の版（定員を Vercel の CAPACITY だけで決めていた版）。新しい schema.sql を上から流しても壊れないかの確認に使う。
-- おおた未来カイギ 申込受付用のテーブルと関数
-- Supabase の SQL Editor にこのファイルの中身を貼り付けて「Run」すると準備が終わります。
-- 何度実行しても大丈夫です（既にあるものは作り直しません）。

create table if not exists public.ota_entries (
  id         bigint generated always as identity primary key,
  name       text        not null,
  kana       text        not null,
  email      text        not null unique,
  phone      text        not null default '',
  created_at timestamptz not null default now()
);

-- 申込者の情報は、サーバー（Vercel の受付プログラム）以外からは読めないようにする
alter table public.ota_entries enable row level security;
revoke all on table public.ota_entries from anon, authenticated;

-- 重複チェック・定員チェック・登録を、ロックをかけて一度に行う（同時申込でも定員を超えない）
-- 戻り値: 1以上 = 登録後の人数、-1 = 満席、-2 = 登録済みのメールアドレス
create or replace function public.ota_register(
  p_name text, p_kana text, p_email text, p_phone text, p_capacity int
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  perform pg_advisory_xact_lock(hashtext('ota_entries'));
  if exists (select 1 from ota_entries where email = p_email) then
    return -2;
  end if;
  select count(*) into n from ota_entries;
  if n >= p_capacity then
    return -1;
  end if;
  insert into ota_entries (name, kana, email, phone)
  values (p_name, p_kana, p_email, coalesce(p_phone, ''));
  return n + 1;
end;
$$;

create or replace function public.ota_count() returns int
language sql
stable
security definer
set search_path = public
as $$ select count(*)::int from ota_entries $$;

-- 関数もサーバー（service_role）からだけ呼べるようにする
revoke execute on function public.ota_register(text, text, text, text, int) from public, anon, authenticated;
revoke execute on function public.ota_count() from public, anon, authenticated;
grant execute on function public.ota_register(text, text, text, text, int) to service_role;
grant execute on function public.ota_count() to service_role;
grant select on table public.ota_entries to service_role;
