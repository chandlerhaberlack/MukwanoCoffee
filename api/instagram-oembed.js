/**
 * Vercel serverless: proxy for Instagram oEmbed.
 * Fetches oEmbed JSON server-side so the embed works on Vercel (avoids browser referrer/blocking).
 * GET /api/instagram-oembed?url=https://www.instagram.com/p/XXX/
 */
const OEMBED_URL = 'https://api.instagram.com/oembed';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const postUrl = req.query.url;
  if (!postUrl || typeof postUrl !== 'string' || postUrl.indexOf('instagram.com/p/') === -1) {
    res.status(400).json({ error: 'Missing or invalid url (must be an Instagram post URL)' });
    return;
  }

  try {
    const oembedUrl = OEMBED_URL + '?url=' + encodeURIComponent(postUrl) + '&omitscript=true&maxwidth=540';
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Instagram oEmbed failed' });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('Instagram oEmbed proxy error:', e.message);
    res.status(502).json({ error: 'Proxy failed' });
  }
}
