const rateLimits = new Map();
const MAX_BODY = 16_384;

export async function handleApi(req, res) {
  if (!req.url?.split('?')[0].startsWith('/api/')) return false;
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(body));
  };
  if (req.url.split('?')[0] !== '/api/inquiry') { send(404, { error: 'Not found' }); return true; }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); send(405, { error: 'Use POST' }); return true; }
  if (!req.headers['content-type']?.includes('application/json')) { send(415, { error: 'JSON required' }); return true; }
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) { send(403, { error: 'Cross-origin submission denied' }); return true; }
    } catch { send(403, { error: 'Invalid origin' }); return true; }
  }
  const now = Date.now();
  for (const [key, value] of rateLimits) if (now - value.start > 60_000) rateLimits.delete(key);
  const ip = req.socket.remoteAddress || 'local';
  const rate = rateLimits.get(ip) || { count: 0, start: now };
  if (++rate.count > 10) { send(429, { error: 'Please wait before trying again' }); return true; }
  rateLimits.set(ip, rate);
  let length = 0;
  let content = '';
  try {
    for await (const chunk of req) {
      length += chunk.length;
      if (length > MAX_BODY) { send(413, { error: 'Request too large' }); return true; }
      content += chunk.toString();
    }
    const body = JSON.parse(content);
    if (!body || typeof body !== 'object' || Array.isArray(body)) { send(400, { error: 'Invalid inquiry' }); return true; }
    if (body.website) { send(400, { error: 'Invalid inquiry' }); return true; }
    const { name, email, business = '', message } = body;
    if (typeof name !== 'string' || !name.trim() || name.length > 120 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000 || typeof business !== 'string' || business.length > 300) {
      send(400, { error: 'Please check your name, email, and message' }); return true;
    }
    const destination = process.env.CONTACT_WEBHOOK_URL;
    if (!destination) { send(503, { error: 'Inquiry delivery has not been configured' }); return true; }
    let webhook;
    try { webhook = new URL(destination); } catch { send(503, { error: 'Inquiry delivery is unavailable' }); return true; }
    if (webhook.protocol !== 'https:') { send(503, { error: 'A secure delivery destination is required' }); return true; }
    try {
      const delivered = await fetch(webhook, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({ source: 'journeys-website', name: name.trim(), email: email.trim(), business: business.trim(), message: message.trim(), submittedAt: new Date().toISOString() })
      });
      if (!delivered.ok) { send(502, { error: 'Delivery failed; please try again' }); return true; }
      send(200, { sent: true });
    } catch { send(502, { error: 'Delivery failed; please try again' }); }
  } catch { send(400, { error: 'Invalid JSON' }); }
  return true;
}
