-- Stap 1 (los te draaien, breekt niets): berichtlimiet en veilige gespreksfuncties.
-- De API praat vanaf nu via deze functies met de database, niet meer rechtstreeks met de tabel.

-- Telt chatberichten per bezoeker (gehasht IP-adres, nooit het echte adres) voor de limiet.
create table if not exists public.chat_usage (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_usage_ip_tijd on public.chat_usage (ip_hash, created_at);
create index if not exists chat_usage_tijd on public.chat_usage (created_at);
alter table public.chat_usage enable row level security;
-- Geen policies: anon en authenticated kunnen niet bij deze tabel, alleen via chat_allow().
revoke all on public.chat_usage from anon, authenticated;

-- Mag dit bericht nog? Controleert per bezoeker per uur en voor de hele site per dag.
-- Bij "ja" wordt het bericht meteen geteld (in één transactie, dus geen dubbeltelling).
create or replace function public.chat_allow(p_ip_hash text, p_per_hour int, p_per_day int)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hour int;
  v_day int;
begin
  if p_ip_hash is null or length(p_ip_hash) < 16 then
    return json_build_object('allowed', false, 'reason', 'invalid');
  end if;
  -- Kleinere limieten dan 1 of absurd grote limieten worden begrensd.
  p_per_hour := least(greatest(coalesce(p_per_hour, 20), 1), 200);
  p_per_day := least(greatest(coalesce(p_per_day, 300), 1), 5000);

  -- Eén bezoeker tegelijk per IP-hash, zodat snelle gelijktijdige verzoeken niet langs de limiet glippen.
  perform pg_advisory_xact_lock(hashtext('chat:' || p_ip_hash));

  select count(*) into v_day from public.chat_usage where created_at > now() - interval '1 day';
  if v_day >= p_per_day then
    return json_build_object('allowed', false, 'reason', 'site_day');
  end if;

  select count(*) into v_hour from public.chat_usage
  where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_hour >= p_per_hour then
    return json_build_object('allowed', false, 'reason', 'visitor_hour');
  end if;

  insert into public.chat_usage (ip_hash) values (p_ip_hash);
  -- Opruimen: tellingen ouder dan 2 dagen zijn niet meer nodig (dataminimalisatie).
  delete from public.chat_usage where created_at < now() - interval '2 days';

  return json_build_object('allowed', true, 'used_hour', v_hour + 1, 'used_day', v_day + 1);
end;
$$;

-- Gesprek van één bezoeker ophalen (de laatste p_limit berichten, oudste eerst).
-- De visitor-id is een willekeurige UUID uit de browser en werkt als sleutel: zonder die id zie je niets.
create or replace function public.chat_get(p_visitor_id text, p_limit int default 40)
returns table (role text, content text)
language sql
security definer
set search_path = ''
as $$
  select m.role, m.content from (
    select role, content, created_at from public.chat_messages
    where visitor_id = p_visitor_id
      and p_visitor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    order by created_at desc
    limit least(greatest(coalesce(p_limit, 40), 1), 100)
  ) m
  order by m.created_at asc;
$$;

-- Vraag en antwoord opslaan.
create or replace function public.chat_save(p_visitor_id text, p_user text, p_reply text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_visitor_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return;
  end if;
  insert into public.chat_messages (visitor_id, role, content, created_at) values
    (p_visitor_id, 'user', left(p_user, 2000), now()),
    (p_visitor_id, 'model', left(p_reply, 8000), now() + interval '1 millisecond');
end;
$$;

-- Het eigen gesprek wissen.
create or replace function public.chat_clear(p_visitor_id text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.chat_messages
  where visitor_id = p_visitor_id
    and p_visitor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
$$;

revoke all on function public.chat_allow(text, int, int) from public;
revoke all on function public.chat_get(text, int) from public;
revoke all on function public.chat_save(text, text, text) from public;
revoke all on function public.chat_clear(text) from public;
grant execute on function public.chat_allow(text, int, int) to anon;
grant execute on function public.chat_get(text, int) to anon;
grant execute on function public.chat_save(text, text, text) to anon;
grant execute on function public.chat_clear(text) to anon;
-- Supabase geeft nieuwe functies standaard ook aan ingelogde gebruikers; die hebben ze hier niet nodig.
revoke execute on function public.chat_allow(text, int, int) from authenticated;
revoke execute on function public.chat_get(text, int) from authenticated;
revoke execute on function public.chat_save(text, text, text) from authenticated;
revoke execute on function public.chat_clear(text) from authenticated;
