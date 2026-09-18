-- ============================================================
-- Work On Time — Marketplace Database Schema
-- Paste this entire file into Supabase Dashboard > SQL Editor > Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ── service_requests ────────────────────────────────────────
create table if not exists service_requests (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  service_type     text not null,
  location         text not null,
  description      text not null,
  urgency          text not null check (urgency in ('high','medium','low')),
  contact_name     text not null,
  whatsapp_number  text not null,
  budget           text,
  status           text not null default 'pending'
                   check (status in ('pending','open','in_progress','completed','rejected')),
  claim_count      integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  approved_at      timestamptz,
  completed_at     timestamptz
);

-- ── request_images ───────────────────────────────────────────
create table if not exists request_images (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references service_requests(id) on delete cascade,
  image_url   text not null,
  created_at  timestamptz not null default now()
);

-- ── claims ───────────────────────────────────────────────────
create table if not exists claims (
  id               uuid primary key default gen_random_uuid(),
  request_id       uuid not null references service_requests(id) on delete cascade,
  provider_name    text not null,
  whatsapp_number  text not null,
  years_experience integer,
  portfolio_url    text,
  background       text not null,
  status           text not null default 'pending'
                   check (status in ('pending','assigned','completed')),
  created_at       timestamptz not null default now(),
  assigned_at      timestamptz,
  completed_at     timestamptz
);

-- ── admin_users ──────────────────────────────────────────────
create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ── Trigger: auto-update updated_at ─────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_service_requests_updated_at on service_requests;
create trigger trg_service_requests_updated_at
  before update on service_requests
  for each row execute function update_updated_at();

-- ── Trigger: keep claim_count in sync ───────────────────────
create or replace function sync_claim_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update service_requests set claim_count = claim_count + 1 where id = new.request_id;
  elsif tg_op = 'DELETE' then
    update service_requests set claim_count = greatest(claim_count - 1, 0) where id = old.request_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_claims_sync_count on claims;
create trigger trg_claims_sync_count
  after insert or delete on claims
  for each row execute function sync_claim_count();

-- ── Row Level Security ───────────────────────────────────────
alter table service_requests enable row level security;
alter table request_images    enable row level security;
alter table claims            enable row level security;
alter table admin_users       enable row level security;

-- Public: can submit new requests (status must be 'pending')
create policy "public_insert_pending" on service_requests
  for insert with check (status = 'pending');

-- Public: can read open/in_progress/completed requests
create policy "public_read_open" on service_requests
  for select using (status in ('open','in_progress','completed'));

-- Admin: full access to all requests
create policy "admin_all" on service_requests
  for all using (auth.uid() in (select id from admin_users));

-- Public: can upload images
create policy "public_insert_images" on request_images
  for insert with check (true);

-- Public: can read images for visible requests
create policy "public_read_images" on request_images
  for select using (
    request_id in (
      select id from service_requests
      where status in ('open','in_progress','completed')
    )
  );

-- Admin: full access to images
create policy "admin_all_images" on request_images
  for all using (auth.uid() in (select id from admin_users));

-- Public: can submit claims
create policy "public_insert_claim" on claims
  for insert with check (true);

-- Admin: full access to claims
create policy "admin_all_claims" on claims
  for all using (auth.uid() in (select id from admin_users));

-- Admin: can read own admin record
create policy "admin_read_self" on admin_users
  for select using (auth.uid() = id);

-- Admin: full access to admin_users
create policy "admin_read_all" on admin_users
  for all using (auth.uid() in (select id from admin_users));

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists idx_sr_status        on service_requests(status);
create index if not exists idx_sr_service_type  on service_requests(service_type);
create index if not exists idx_sr_created_at    on service_requests(created_at desc);
create index if not exists idx_claims_req_id    on claims(request_id);
create index if not exists idx_images_req_id    on request_images(request_id);

-- ============================================================
-- RLS FIX MIGRATION (run this block alone any time posting or
-- claiming fails with "violates row-level security policy").
-- Safe to re-run: every statement is idempotent.
-- ============================================================

-- Anonymous posting/claiming must exist even if the top half of
-- this file was only partially applied earlier.
drop policy if exists "public_insert_pending" on service_requests;
create policy "public_insert_pending" on service_requests
  for insert with check (status = 'pending');

drop policy if exists "public_read_open" on service_requests;
create policy "public_read_open" on service_requests
  for select using (status in ('open','in_progress','completed'));

drop policy if exists "public_insert_images" on request_images;
create policy "public_insert_images" on request_images
  for insert with check (true);

drop policy if exists "public_read_images" on request_images;
create policy "public_read_images" on request_images
  for select using (
    request_id in (
      select id from service_requests
      where status in ('open','in_progress','completed')
    )
  );

drop policy if exists "public_insert_claim" on claims;
create policy "public_insert_claim" on claims
  for insert with check (true);

-- Photo uploads need a public bucket + storage policies
-- (the app uploads to the "request-images" bucket).
insert into storage.buckets (id, name, public)
  values ('request-images', 'request-images', true)
  on conflict (id) do update set public = true;

drop policy if exists "public_upload_request_images" on storage.objects;
create policy "public_upload_request_images" on storage.objects
  for insert with check (bucket_id = 'request-images');

drop policy if exists "public_read_request_images" on storage.objects;
create policy "public_read_request_images" on storage.objects
  for select using (bucket_id = 'request-images');

-- ============================================================
-- PORTFOLIO (admin manage-portfolio page)
-- Table was missing from earlier schema versions: uploads failed
-- with "Bucket not found" / table errors. Idempotent: safe to re-run.
-- ============================================================

create table if not exists portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null,
  media_url  text not null,
  media_type text not null default 'image'
             check (media_type in ('image','video')),
  created_at timestamptz not null default now()
);

alter table portfolio_items enable row level security;

drop policy if exists "public_read_portfolio" on portfolio_items;
create policy "public_read_portfolio" on portfolio_items
  for select using (true);

drop policy if exists "admin_all_portfolio" on portfolio_items;
create policy "admin_all_portfolio" on portfolio_items
  for all using (auth.uid() in (select id from admin_users));

insert into storage.buckets (id, name, public)
  values ('portfolio', 'portfolio', true)
  on conflict (id) do update set public = true;

drop policy if exists "public_read_portfolio" on storage.objects;
create policy "public_read_portfolio" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "admin_upload_portfolio" on storage.objects;
create policy "admin_upload_portfolio" on storage.objects
  for insert with check (
    bucket_id = 'portfolio'
    and auth.uid() in (select id from admin_users)
  );

drop policy if exists "admin_delete_portfolio" on storage.objects;
create policy "admin_delete_portfolio" on storage.objects
  for delete using (
    bucket_id = 'portfolio'
    and auth.uid() in (select id from admin_users)
  );

-- ============================================================
-- CALLBACK REQUESTS (contact "Request callback" form → admin inbox)
-- Idempotent: safe to re-run.
-- ============================================================

create table if not exists callback_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  service    text not null,
  message    text,
  status     text not null default 'new'
             check (status in ('new','contacted','done')),
  created_at timestamptz not null default now()
);

alter table callback_requests enable row level security;

drop policy if exists "public_insert_callback" on callback_requests;
create policy "public_insert_callback" on callback_requests
  for insert with check (true);

drop policy if exists "admin_all_callbacks" on callback_requests;
create policy "admin_all_callbacks" on callback_requests
  for all using (auth.uid() in (select id from admin_users));
