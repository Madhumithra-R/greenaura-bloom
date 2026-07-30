# GreenAura — Premium Indoor Plants E-Commerce

A full-stack, production-ready plant shop built with React, TypeScript, Vite, Tailwind CSS, and Lovable Cloud (Postgres + Auth + Edge Functions).

**Live demo:** https://greenaura-bloom.lovable.app  
**Preview:** https://id-preview--1f8e1c59-7a57-48d7-b948-f02c2701d6d0.lovable.app

---

## What it does

GreenAura is a premium indoor plant e-commerce experience. Visitors can browse a live catalog of plants, filter and search by category, view detailed care guides, save favorites to a wishlist, manage a per-user cart, and check out with real inventory tracking. Signed-in users see their order history, while admins can manage products, orders, and customer messages.

The project also includes an AI plant concierge that gives personalized recommendations based on the live product catalog.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript 5, Vite 5, Tailwind CSS 3, shadcn/ui |
| State & data | TanStack Query (React Query), React Hook Form + Zod |
| Backend | Lovable Cloud — Postgres database, built-in auth, storage, edge functions |
| Animations | Framer Motion |
| Icons | Lucide React |
| Testing | Vitest (unit), Playwright (E2E) |

---

## Key features

- **Authentication** — Email/password and Google OAuth sign-in, auto-created user profiles, role-based access (`admin` / `user`).
- **Live product catalog** — Products stored in Postgres, pulled dynamically into the homepage, shop, and product detail pages.
- **Product detail pages** (`/product/:id`) — Care requirements (light, water, difficulty, mature size), related plants, dynamic title/meta, and JSON-LD structured data for SEO.
- **Shop experience** — Live search, sorting (price, name, featured), category filters, pagination, and result counts.
- **Wishlist** — Heart "Save" buttons on cards, a dedicated `/wishlist` page, and a navbar counter.
- **Cart & atomic checkout** — Per-user cart with quantity controls; checkout runs through a secure edge function that validates stock, creates the order, decrements inventory, and clears the cart in one transaction.
- **Order history** — Users can view past orders at `/orders`.
- **Contact form** — Submissions are saved to the backend and readable by admins.
- **Admin dashboard** (`/admin`) — Add/remove products, view all orders and customer messages (admin role required).
- **AI plant assistant** — Floating chat widget on home, shop, and product pages; streams personalized plant recommendations grounded in the live catalog.
- **Security** — Row Level Security (RLS) on every table, validated contact-form inserts, SECURITY DEFINER functions not directly callable by end users.

---

## Project structure

```text
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (Hero, Navbar, Footer, etc.)
│   ├── hooks/               # Custom hooks: useAuth, useCart, useWishlist
│   ├── integrations/        # Auto-generated Supabase client
│   ├── lib/                 # Utilities, catalog mapping, helpers
│   ├── pages/               # Route-level pages (Shop, Cart, Wishlist, Admin, etc.)
│   ├── App.tsx              # Main app shell with routes
│   └── main.tsx             # Entry point
├── supabase/
│   ├── functions/           # Edge functions (place-order, plant-assistant)
│   └── migrations/          # Database migrations
├── index.html               # HTML shell with SEO meta tags
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── playwright.config.ts
```

---

## Database schema (high-level)

- `profiles` — public user profiles linked to auth users.
- `user_roles` — separate role table (`admin` / `user`) with a `has_role` security definer helper.
- `products` — plant catalog with inventory, pricing, category, care fields, and image URLs.
- `cart_items` — per-user cart lines.
- `orders` & `order_items` — order history and line items.
- `contact_messages` — contact form submissions.
- `wishlist_items` — saved plants per user.

All tables have RLS enabled and are only accessible according to the user's role and ownership.

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 20+
- A Lovable Cloud project (Supabase backend is auto-provisioned)

### Install dependencies

```bash
bun install
```

### Run the dev server

```bash
bun run dev
```

The app will be available at `http://localhost:8080`.

### Run tests

```bash
# Unit tests
bun run test

# E2E tests (requires dev server running)
bun run test:e2e
```

---

## Environment variables

The project uses Vite environment variables. In development, these are typically provided by Lovable Cloud. Required variables:

```bash
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
```

> Do not commit `.env` files or service-role keys to version control.

---

## Deployment

The app is deployed through Lovable. You can also connect the project to GitHub for two-way sync:

1. In the Lovable editor, open the **Plus (+)** menu → **GitHub** → **Connect project**.
2. Authorize the Lovable GitHub App.
3. Choose the account/organization and create the repository.
4. Future edits in Lovable push to GitHub, and local pushes sync back to Lovable.

---

## Design decisions

- **Postgres + RLS instead of a custom backend** — keeps the stack serverless and secure while demonstrating production-grade database design.
- **Separate `user_roles` table** — avoids privilege escalation risks from storing roles directly on the user/profile table.
- **Atomic checkout via edge function** — prevents overselling by validating stock and decrementing inventory in a single transaction.
- **AI assistant grounded in live catalog** — ensures recommendations are accurate, current, and tied to real products.
- **Zod for all form validation** — consistent, type-safe input validation on both client and server-adjacent logic.

---

## Future improvements

- Real payments with Stripe + webhook-driven order-status flow
- Order confirmation and shipping notification emails
- Product reviews & ratings from verified buyers
- Guest cart that merges on sign-in
- Advanced filters: price range, pet-safe, difficulty, light/water needs
- SEO sitemap, `robots.txt`, and OG images per page
- Accessibility audit: focus rings, skip links, ARIA labels
- PWA support with offline browsing

---

## License

This project is built for portfolio and educational purposes. Feel free to use it as a reference for your own work.

---

Built with ❤️ using [Lovable](https://lovable.dev).
