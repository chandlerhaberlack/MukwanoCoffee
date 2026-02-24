# Mukwano Coffee Website

A refreshed, mobile-first website for Mukwano Coffee (Rawlins, WY). Built with HTML, Tailwind CSS (CDN), and vanilla JavaScript.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Pages

- **index.html** – Home (hero, about preview, featured products, subscription CTA, map, Instagram, contact form)
- **about.html** – Our story, vision, Why Choose Mukwano
- **shop.html** – Product grid with filters; links to existing Wix product pages and Bitcoin checkout
- **subscribe.html** – Subscription plans (local delivery / shipping)
- **find-us.html** – Roastery map, retail partners, podcast sponsors
- **wholesale.html** – Wholesale inquiry form
- **contact.html** – Contact form, hours, Bitcoin invoice note

## Customization

- **Contact/wholesale forms** – Replace the `action` URL in the form with your Formspree or other endpoint.
- **Logo / images** – Replace files in `images/` as needed. The hero uses an Unsplash image URL; you can switch to a local file.

### Instagram embed (latest post)

The homepage can show @mukwanocoffee’s latest Instagram post in two ways:

**Option A – Manual post URL (no backend)**  
Paste a specific post URL into the homepage so it embeds even without the API:

1. Open **index.html** and find the Instagram section (search for `id="instagram-section"`).
2. Set the `data-instagram-post` attribute to a post URL, for example:
   ```html
   <section ... id="instagram-section" data-instagram-post="https://www.instagram.com/p/ABC123xyz/">
   ```
3. To get the URL: open Instagram → go to @mukwanocoffee → open a post → copy the link from the browser (e.g. `https://www.instagram.com/p/ABC123xyz/`).
4. When the API is not available (or not configured), the script will use this URL and embed it via Instagram’s oEmbed. Update it whenever you want to show a different post.

**Option B – Automatic “latest post” (needs backend)**  
To always show the most recent post without editing the page:

1. **Deploy to Vercel** (or another host that runs the `api/` serverless function).
2. **Create a Meta app and get a token:**
   - Go to [developers.facebook.com](https://developers.facebook.com/) → Create App → choose “Business” or “Other”.
   - Add the **Instagram Graph API** product.
   - In **Facebook Login** (or **Instagram Graph API**) settings, ensure you have a **Facebook Page** and that your **Instagram account** (@mukwanocoffee) is a **Business or Creator** account connected to that Page (Instagram app: Settings → Account → Switch to professional account → connect to a Facebook Page).
   - In the Meta app: **Tools** → **Graph API Explorer**. Select your app and the Page, request `instagram_basic` and `pages_show_list`, generate a **User Token**, then use “Get Page Access Token” to get a **Page Access Token**. Use a **long-lived** token (via the token debugger / exchange flow) so it doesn’t expire quickly.
3. **Set the token in Vercel:** Project → **Settings** → **Environment Variables** → add:
   - **Name:** `INSTAGRAM_PAGE_ACCESS_TOKEN`  
   - **Value:** your Page Access Token  
   (Redeploy after saving.)
4. The `api/instagram-latest.js` function will then return the latest post URL, and the homepage will embed it automatically.

## Mobile

Optimized for iPhone 14+ (390px width) with viewport-fit=cover and safe-area insets. Hamburger nav, 44px tap targets for primary actions.
