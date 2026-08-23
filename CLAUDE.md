# About This Project

Addy is a beginner coder. This is a small handmade-craft shop website
Addy runs with her cousin: a home page, a shop page with a product grid,
a cart, and an order-request form. Explanations should stay
beginner-friendly, jargon-free, and avoid introducing frameworks or
build tools — plain HTML, CSS, and vanilla JavaScript only.

## Who makes what
- Addy: 3D printed items (keychains, phone stands, fidget spinners, desk
  organizers, custom name signs)
- Cousin: paper and balloon squishies (part of the viral squishy trend)

## Design choices
- Teal/coral/cream palette (see `:root` in `style.css`)
- Fonts: "Baloo 2" for headings, "Nunito" for body text — same pairing
  used across Addy's other sites
- No product photos yet — each product card shows a blank "photo coming
  soon" placeholder box (same pattern as the recipe-book and BCS Store
  sites). Swap in real `<img>` tags once you have photos.

## How things work
- **Products** live in `PRODUCTS` at the top of `app.js` — id, name,
  maker (who made it, just for display), and price. All placeholders —
  update with your real items/prices.
- **Cart** is shared across every page via `localStorage` (`craftCart`).
- **Order form** (`order.html`) submits to `ORDER_WORKER_URL` in
  `app.js` — currently a placeholder. Needs a Cloudflare Worker exactly
  like the babysitting site's booking form: ask an adult to help set one
  up, then paste the real Worker URL in. Until then, submitting shows a
  friendly "not set up yet" message instead of crashing.
- **Payment**: cash or check at pickup/delivery — no online payment.
- `app.js` is shared by every page; page-specific blocks (product grid,
  cart list, order form) are each wrapped in a check for that page's
  elements, so nothing crashes on a page that doesn't have them.

## Domain name
- Addy asked about using `craft.com` — that's already registered/in use
  by someone else and not available to buy.
- The site is deployed for free right now at a Firebase `.web.app`
  address (see below). A custom domain (like the babysitting site's
  `babysittingwith.addisonmckinnon.com`) would need buying a domain name
  — that costs real money and needs a parent's payment method, plus
  connecting it through a service like Cloudflare (same as the
  babysitting site).

## How the site gets published
- Deployed to Firebase Hosting: **https://craft-store-addy.web.app**
- To redeploy after changes: `firebase deploy --only hosting` from this
  folder.

## Next steps for Addy & cousin
- [ ] Take real photos of your products and swap them in for the
      placeholder boxes
- [ ] Update `PRODUCTS` in `app.js` with real prices/items
- [ ] With an adult: build a Cloudflare Worker for order submissions
      (same pattern as the babysitting site), then set `ORDER_WORKER_URL`
- [ ] Decide on a real domain name if you want one instead of the free
      `.web.app` link (see "Domain name" above)
