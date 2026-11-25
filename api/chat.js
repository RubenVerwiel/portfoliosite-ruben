import { createHash } from 'node:crypto';
import { buildSystemPrompt } from './_knowledge.js';

const SYSTEM_PROMPT = buildSystemPrompt();

// Limieten tegen misbruik en onverwachte kosten. Aan te passen met env-variabelen in Vercel.
const LIMIT_PER_HOUR = Number(process.env.CHAT_LIMIT_PER_HOUR) || 20; // per bezoeker
const LIMIT_PER_DAY = Number(process.env.CHAT_LIMIT_PER_DAY) || 300; // voor de hele site samen
const MAX_MESSAGE_CHARS = 1000; // langere vragen worden geweigerd
const MAX_HISTORY = 20; // alleen de laatste 20 berichten gaan mee naar Gemini (houdt kosten per vraag laag)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const validVisitor = (id) => typeof id === 'string' && UUID_RE.test(id);

// Alle databasewerk loopt via functies in Supabase (chat_allow, chat_get, chat_save, chat_clear).
// De tabel zelf is niet rechtstreeks bereikbaar met de publieke key.
async function rpc(fn, args) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Supabase ${fn} gaf ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Het IP-adres wordt nooit opgeslagen, alleen een hash ervan (met een geheime salt als die is ingesteld).
function visitorHash(req) {
  const fwd = req.headers?.['x-forwarded-for'];
  const ip = (typeof fwd === 'string' && fwd.split(',')[0].trim())
    || req.headers?.['x-real-ip']
    || req.socket?.remoteAddress
    || 'onbekend';
  const salt = process.env.CHAT_IP_SALT || process.env.SUPABASE_URL || '';
  return createHash('sha256').update(`${salt}|${ip}`).digest('hex');
}

const LIMIT_TEXT = {
  visitor_hour: `Je hebt het maximum van ${LIMIT_PER_HOUR} vragen per uur bereikt. Probeer het over een uur opnieuw, of mail Ruben direct.`,
  site_day: 'De AI-assistent heeft vandaag zijn maximum aantal gesprekken bereikt. Probeer het morgen opnieuw, of mail Ruben direct.',
  invalid: 'Je vraag kon niet worden verwerkt.',
};

export default async function handler(req, res) {
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

  if (req.method === 'GET') {
    const visitorId = req.query?.visitorId;
    if (!validVisitor(visitorId) || !hasSupabase) {
      res.status(200).json({ messages: [] });
      return;
    }
    try {
      const messages = await rpc('chat_get', { p_visitor_id: visitorId, p_limit: 40 });
      res.status(200).json({ messages: messages || [] });
    } catch {
      res.status(200).json({ messages: [] });
    }
    return;
  }

  if (req.method === 'DELETE') {
    const visitorId = req.query?.visitorId;
    if (validVisitor(visitorId) && hasSupabase) {
      try { await rpc('chat_clear', { p_visitor_id: visitorId }); } catch { /* lokaal is het gesprek al leeg */ }
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is niet geconfigureerd op de server.' });
    return;
  }
  // Zonder database kan de limiet niet bewaakt worden; dan liever geen chat dan onbeperkte kosten.
  if (!hasSupabase) {
    res.status(503).json({ error: 'De AI-assistent is tijdelijk niet beschikbaar.' });
    return;
  }

  const { message, visitorId } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Veld "message" (string) is verplicht.' });
    return;
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    res.status(400).json({ error: `Je vraag is te lang (maximaal ${MAX_MESSAGE_CHARS} tekens).` });
    return;
  }

  // Eerst de limiet: pas als die "ja" zegt, wordt Gemini aangeroepen.
  try {
    const verdict = await rpc('chat_allow', {
      p_ip_hash: visitorHash(req),
      p_per_hour: LIMIT_PER_HOUR,
      p_per_day: LIMIT_PER_DAY,
    });
    if (!verdict?.allowed) {
      res.status(429).json({ error: LIMIT_TEXT[verdict?.reason] || LIMIT_TEXT.invalid });
      return;
    }
  } catch {
    res.status(503).json({ error: 'De AI-assistent is tijdelijk niet beschikbaar.' });
    return;
  }

  let priorMessages = [];
  if (validVisitor(visitorId)) {
    try { priorMessages = (await rpc('chat_get', { p_visitor_id: visitorId, p_limit: MAX_HISTORY })) || []; } catch { /* zonder historie verder */ }
  }
  const contents = [
    ...priorMessages.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        // Key in een header in plaats van in de URL, zodat hij niet in logs terechtkomt.
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(502).json({ error: 'De AI-assistent kon nu geen antwoord geven. Probeer het later opnieuw.' });
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (validVisitor(visitorId) && reply) {
      try { await rpc('chat_save', { p_visitor_id: visitorId, p_user: message, p_reply: reply }); } catch { /* antwoord toch tonen */ }
    }

    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: 'Onverwachte serverfout bij aanroepen van Gemini.' });
  }
}
