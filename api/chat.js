function supabaseHeaders() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

async function loadHistory(visitorId) {
  const url = process.env.SUPABASE_URL;
  const res = await fetch(
    `${url}/rest/v1/chat_messages?visitor_id=eq.${encodeURIComponent(visitorId)}&select=role,content&order=created_at.asc`,
    { headers: supabaseHeaders() }
  );
  if (!res.ok) return [];
  return res.json();
}

async function saveMessages(visitorId, rows) {
  const url = process.env.SUPABASE_URL;
  await fetch(`${url}/rest/v1/chat_messages`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify(rows.map((r) => ({ visitor_id: visitorId, role: r.role, content: r.content }))),
  });
}

export default async function handler(req, res) {
  const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY;

  if (req.method === 'GET') {
    const visitorId = req.query?.visitorId;
    if (!visitorId || !hasSupabase) {
      res.status(200).json({ messages: [] });
      return;
    }
    const messages = await loadHistory(visitorId);
    res.status(200).json({ messages });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.1';

  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is niet geconfigureerd op de server.' });
    return;
  }

  const { message, visitorId } = req.body || {};
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Veld "message" (string) is verplicht.' });
    return;
  }

  const priorMessages = visitorId && hasSupabase ? await loadHistory(visitorId) : [];
  const contents = [
    ...priorMessages.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Gemini-aanvraag mislukt.' });
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (visitorId && hasSupabase) {
      await saveMessages(visitorId, [
        { role: 'user', content: message },
        { role: 'model', content: reply },
      ]);
    }

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Onverwachte serverfout bij aanroepen van Gemini.' });
  }
}
