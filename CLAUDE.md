# About This Project

Addy is a beginner coder. This is a small handmade-craft shop website
Addy runs with her cousin: a home page, a shop page with a product grid,
a cart, and an order-request form. Explanations should stay
beginner-friendly, jargon-free, and avoid introducing frameworks or
build tools — plain HTML, CSS, and vanilla JavaScript only.

## Who makes what
- Addy: 3D printed items (keychains, phone stands, fidget spinners, desk
  organizers, custom name signs)
- Cousin: paper and clay squishies (part of the viral squishy trend, including mystery dumpling squishies)

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

## Paid membership passcode
- `member.html` has two parts: anyone can click "I Want to Join" to see
  the join instructions, but the 10% discount only turns on after
  entering `MEMBER_PASSCODE` (set in `app.js`, currently `"craft10"`).
- There's no automatic emailing yet — when a customer pays the $10/month
  at pickup, you or your cousin manually email them the current
  passcode. If it gets shared around too much, change `MEMBER_PASSCODE`
  in `app.js` and redeploy; anyone already activated stays activated
  since that's tracked separately per-device.
- Canceling requires its own separate passcode, `CANCEL_PASSCODE` in
  `app.js` (currently `"123shop"`) — so a member can't accidentally (or
  a random visitor can't) cancel with one click. Only Addy/cousin should
  know this one; give it out to a member only if they actually want to
  cancel.

## Cousins-only text thread
- `private.html` (behind the "ae" passcode) is a real, live, two-way chat
  between Addy and her cousin — not just local notes. It uses its own
  Firebase Realtime Database (`chat.js`, config at the top), set up in
  the same `craft-store-addy` Firebase project as hosting.
- On first visit each person picks "I'm Addy" or "I'm Cousin" (saved in
  `localStorage`), which decides which side their bubbles show on. Text
  messages send instantly to both people via `privateChat/messages` in
  the database and support emoji (the row of quick-tap buttons above the
  input, or typing them directly).
- The database rules are wide open (`.read`/`.write`: true) so anyone
  with the database URL could technically read/write it — the "ae"
  passcode is the only thing actually keeping randoms out, same as the
  rest of this site's passcodes. Good enough for two cousins texting
  about crafts, not for anything truly sensitive.

## Next steps for Addy & cousin
- [ ] Take real photos of your products and swap them in for the
      placeholder boxes
- [ ] Update `PRODUCTS` in `app.js` with real prices/items
- [ ] With an adult: build a Cloudflare Worker for order submissions
      (same pattern as the babysitting site), then set `ORDER_WORKER_URL`
- [ ] Decide on a real domain name if you want one instead of the free
      `.web.app` link (see "Domain name" above)
