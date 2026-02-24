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
- **Instagram latest post** – The homepage fetches and embeds @mukwanocoffee’s latest Instagram post. To enable this when deploying to **Vercel**, add a serverless API (see `api/instagram-latest.js`) and set **Environment Variables**: `INSTAGRAM_PAGE_ACCESS_TOKEN` (Facebook Page access token for the Page linked to the Instagram Business/Creator account). Optionally set `INSTAGRAM_USER_ID` and `INSTAGRAM_ACCESS_TOKEN` instead. Without the API (e.g. local or static host), the section shows a “Follow on Instagram” card and image grid.
- **Logo / images** – Replace files in `images/` as needed. The hero uses an Unsplash image URL; you can switch to a local file.

## Mobile

Optimized for iPhone 14+ (390px width) with viewport-fit=cover and safe-area insets. Hamburger nav, 44px tap targets for primary actions.
