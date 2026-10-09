import { isConfigured, status } from './_store.js';

// GET /api/status → { capacity, count, remaining, open }
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!isConfigured()) {
    return res.status(503).json({ error: 'not_configured' });
  }
  try {
    return res.status(200).json(await status());
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
