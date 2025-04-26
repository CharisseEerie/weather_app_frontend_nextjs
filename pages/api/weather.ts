import type { NextApiRequest, NextApiResponse } from 'next';

// allow self-signed certs inside Codespaces (dev only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiRes = await fetch(
      'http://0.0.0.0:8000/api/weather'          // internal address
    );
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Backend unreachable' });
  }
}

