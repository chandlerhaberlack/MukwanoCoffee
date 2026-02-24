/**
 * Vercel serverless: returns the latest Instagram post URL for @mukwanocoffee.
 * Requires INSTAGRAM_PAGE_ACCESS_TOKEN (Facebook Page token with linked IG Business account)
 * or INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN.
 * Set in Vercel: Project → Settings → Environment Variables.
 */
const GRAPH_BASE = 'https://graph.facebook.com/v21.0';

async function getLatestPostUrl() {
  const pageToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  let igUserId = userId;
  let token = accessToken || pageToken;

  if (!token) {
    return null;
  }

  try {
    if (!igUserId && pageToken) {
      const meRes = await fetch(
        `${GRAPH_BASE}/me?fields=instagram_business_account&access_token=${encodeURIComponent(pageToken)}`
      );
      const meData = await meRes.json();
      igUserId = meData?.instagram_business_account?.id;
      if (!igUserId) return null;
      token = pageToken;
    }

    if (!igUserId) return null;

    const mediaRes = await fetch(
      `${GRAPH_BASE}/${igUserId}/media?fields=permalink,media_type,media_url&limit=1&access_token=${encodeURIComponent(token)}`
    );
    const mediaData = await mediaRes.json();
    const first = mediaData?.data?.[0];
    return first?.permalink || null;
  } catch (e) {
    console.error('Instagram API error:', e.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = await getLatestPostUrl();
  if (url) {
    res.status(200).json({ url });
  } else {
    res.status(404).json({ error: 'No post or token not configured' });
  }
}
