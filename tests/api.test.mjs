import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handleApi } from '../server/api.mjs';

const server = createServer((req, res) => handleApi(req, res).then(handled => { if (!handled) { res.writeHead(404); res.end(); } }));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const inquiry = { name: 'Test visitor', email: 'visitor@example.com', business: 'Example', message: 'A custom website for our small business.', website: '' };
const submit = (body, headers = {}) => fetch(base + '/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
test.after(() => server.close());

test('rejects incomplete submissions', async () => {
  const response = await submit({ ...inquiry, email: 'invalid' });
  assert.equal(response.status, 400);
});
test('does not pretend an inquiry was sent without a delivery destination', async () => {
  const previous = process.env.CONTACT_WEBHOOK_URL;
  delete process.env.CONTACT_WEBHOOK_URL;
  try { assert.equal((await submit(inquiry)).status, 503); }
  finally { if (previous !== undefined) process.env.CONTACT_WEBHOOK_URL = previous; }
});
test('rejects foreign-origin form posts', async () => {
  assert.equal((await submit(inquiry, { Origin: 'https://unrelated.example' })).status, 403);
});
test('rejects insecure webhook configuration', async () => {
  const previous = process.env.CONTACT_WEBHOOK_URL;
  process.env.CONTACT_WEBHOOK_URL = 'http://example.com';
  try { assert.equal((await submit(inquiry)).status, 503); }
  finally { if (previous === undefined) delete process.env.CONTACT_WEBHOOK_URL; else process.env.CONTACT_WEBHOOK_URL = previous; }
});
test('reports successful delivery only after the webhook accepts it', async () => {
  const previous = process.env.CONTACT_WEBHOOK_URL;
  const originalFetch = globalThis.fetch;
  process.env.CONTACT_WEBHOOK_URL = 'https://delivery.example/inquiries';
  let payload;
  globalThis.fetch = async (url, options) => {
    if (String(url).startsWith('https://delivery.example/')) {
      payload = JSON.parse(options.body);
      return new Response('{}', { status: 200 });
    }
    return originalFetch(url, options);
  };
  try {
    const response = await submit(inquiry);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).sent, true);
    assert.equal(payload.email, inquiry.email);
    assert.equal(payload.message, inquiry.message);
  } finally { globalThis.fetch = originalFetch; if (previous === undefined) delete process.env.CONTACT_WEBHOOK_URL; else process.env.CONTACT_WEBHOOK_URL = previous; }
});
