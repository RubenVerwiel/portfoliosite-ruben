-- Stap 2 (pas draaien NADAT de nieuwe api/chat.js live staat):
-- de tabel chat_messages is niet meer rechtstreeks bereikbaar met de publieke key.
-- Eerder mocht iedereen met die key ALLE gesprekken lezen en wissen (policies met "true").
-- Daarna kan dat alleen nog via chat_get / chat_save / chat_clear, en alleen met de eigen visitor-id.

drop policy if exists "Bezoekers mogen berichten lezen" on public.chat_messages;
drop policy if exists "Bezoekers mogen berichten plaatsen" on public.chat_messages;
drop policy if exists "Bezoekers mogen hun gesprek wissen" on public.chat_messages;
revoke all on public.chat_messages from anon, authenticated;
alter table public.chat_messages enable row level security;
