import { CAPACITY, count, isConfigured } from './_store.js';

// GET /api/status → { capacity, count, remaining, open }
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!isConfigured()) {
    return res.status(503).json({ error: 'not_configured' });
  }
  try {
    const n = await count();
    const remaining = Math.max(CAPACITY - n, 0);
    return res.status(200).json({ capacity: CAPACITY, count: n, remaining, open: remaining > 0 });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
