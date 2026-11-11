# BUILD CLOTHING — Premium Gen Z Streetwear E-Commerce Platform

> **"BUILT DIFFERENT. Streetwear for the ones who never follow the crowd."**

BUILD CLOTHING is a full-stack, production-ready premium streetwear e-commerce platform engineered with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and secure server-validated business logic. It combines editorial fashion aesthetics with modern digital streetwear culture, high-density 240+ GSM heavyweight fabrics, limited numbered drops, an advanced admin command center, live inventory auditing, transactional email notifications, and an integrated payment pipeline.

---

## ⚡ Live Demo Credentials & Stitch Integration

The project integrates the official **Stitch Project ID: `10380427180637349295` (BUILD CLOTHING — Homepage `0b236203b2154742ad03ad061eff8b13`)**, downloading all 22 high-resolution editorial streetwear photo assets into `public/images/stitch/` and applying the full layout across the homepage, navbar, and custom print lab.

- **Local Server URL:** `http://localhost:3000`
- **Custom Print Studio:** `http://localhost:3000/custom-print`
- **Shop Catalog:** `http://localhost:3000/shop`
- **Admin Hub:** `http://localhost:3000/admin`

You can test both roles using the one-click demo login buttons directly on the [Sign In Page](/auth/login):

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@buildclothing.com` | `Admin@123456` | [`/admin`](file:///c:/Users/Suraj%20Yadav/OneDrive/Documents/Clothing%20Brand/src/app/admin/page.tsx) (Operations Command Center) |
| **Customer** | `customer@buildclothing.com` | `Customer@123456` | [`/account`](file:///c:/Users/Suraj%20Yadav/OneDrive/Documents/Clothing%20Brand/src/app/account/page.tsx) & Storefront |

### 🎟️ Verified Active Promo Codes

All promo codes are fully database-backed, synchronized in real-time between the Admin Dashboard and Customer Checkout:

| Promo Code | Discount | Terms / Min Order | Notes |
| :--- | :--- | :--- | :--- |
| **`SURAJ300`** | **50% OFF** | Min. ₹499 (Max cap: ₹1,500) | Flagship VIP promo code |
| **`BUILD10`** | **10% OFF** | Min. ₹999 (Max cap: ₹500) | Welcome discount |
| **`GENZ15`** | **15% OFF** | Min. ₹1,999 (Max cap: ₹800) | High-cart drop discount |
| **`FREESHIP`** | **₹100 OFF** | Min. ₹499 | Shipping charge rebate |

---

## 🎨 1. Brand Identity & Creative Design System

The platform strictly avoids generic corporate SaaS or violet/purple gradient layouts. It embodies high-contrast brutalist editorial typography, subtle grain textures, drop-shoulder silhouettes, and controlled electric lime accents.

### Color Palette

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Primary Background** | `#F5F3EE` | Warm paper / vintage cotton canvas background |
| **Primary Text** | `#151515` | High-contrast pitch black editorial copy |
| **Secondary Surface** | `#E8E5DE` | Product frames, table cards, drawer surfaces |
| **Controlled Accent** | `#D8FF36` | **Electric Lime** for drop badges, progress indicators & CTAs |
| **Dark Sections** | `#101010` | Manifesto hero, drop countdown, footer & marquee |
| **Muted Text** | `#777777` | Monospace specs, technical timestamps, labels |

### Typography Hierarchy
- **Campaign & Drop Display:** `Bebas Neue` / `Impact` (Oversized, ultra-condensed uppercase titles)
- **Headings & Badges:** `Space Grotesk` (Modern geometric grotesque)
- **Body & Technical Specs:** `Inter` & System Monospace (Clean, readable garment specifications)

---

## 🛠️ 2. Technology Stack & Architecture

- **Framework:** Next.js 14 (App Router, Server & Client Components, Route Handlers, Edge Middleware)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4 with custom extensions & font variables
- **Icons:** Lucide React
- **Validation:** Zod schema validation across all inputs
- **ORM & Database:** Prisma 5.22 with SQLite (local development zero-config) and seamless 1-line switch to managed PostgreSQL
- **Security & Authentication:**
  - Password hashing with `bcryptjs` (salt rounds: 10)
  - JWT session tokens stored in secure, HTTP-only cookies (`bld_token`)
  - Server-side and Edge Middleware role verification (`CUSTOMER`, `ADMIN`, `SUPER_ADMIN`)
  - Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- **Cart & Pricing Engine:**
  - Client state synchronization with `localStorage`
  - Zero-trust server calculation of item unit prices, discounts, and shipping tiers
- **Payments:**
  - Razorpay Online Payment Gateway integration (UPI, Debit/Credit Cards, NetBanking)
  - Cash on Delivery (COD) configurable fulfillment pipeline
- **Shipping & Fulfillment:**
  - Indian PIN code serviceability validation (2–4 days express delivery)
  - Courier assignment (Delhivery Express, BlueDart) & AWB tracking ID generation

---

## 📦 3. Features & Storefront Modules

### 3.1 Advanced Animations & Microinteractions (Section 21)
- **Custom Desktop Cursor:** Minimal dual-ring cursor with magnetic hover detection on buttons, links, and products. Automatically disabled on touch screens and devices with reduced-motion preferences.
- **Sticky Mobile Add-to-Cart:** Floating bottom conversion bar on mobile viewports showing selected fit, price, and instant Add-to-Bag trigger.
- **Microinteractions:** Smooth hover image swapping, quick size selector overlays, animated cart drawer transitions, and live countdown timers.

### 3.2 Product Search Engine (Section 22)
- Fast search API endpoint at `/api/search/suggestions` supporting live auto-suggestions, title matching, fabric and fit taxonomy, and category links.
- Instant search bar integrated in the sticky header.

### 3.3 Customer Storefront & Landing Experience
- **Announcement Bar:** Cycling multi-banner announcement with CMS editing support (Free Shipping above ₹1,499, New Drops, Coupons).
- **Navigation Bar:** Sticky responsive navbar with live cart badge counter, instant search query drawer, mobile menu drawer, and account quick links.
- **Cinematic Hero:** High-contrast editorial hero featuring streetwear campaign imagery, animated badge indicators, and dual CTAs (`SHOP THE DROP` / `EXPLORE COLLECTIONS`).
- **Infinite Typography Marquee:** Continuous horizontal typography marquee (`BUILT DIFFERENT • WEAR YOUR IDENTITY • NO ORDINARY FITS • BUILD CLOTHING`).
- **Featured Collections:** Interactive collection showcase (`THE OVERSIZED EDIT`, `GRAPHIC UNIVERSE`, `EVERYDAY ESSENTIALS`, `LIMITED DROPS`).
- **Trending Products Grid:** Real-time database products featuring quick size selectors (`S`, `M`, `L`, `XL`, `XXL`), color swatches, badges (`NEW DROP`, `BESTSELLER`, `LIMITED`, `SOLD OUT`), and wishlist toggles.
- **New Drop Countdown:** Live countdown timer with Days/Hours/Minutes/Seconds display and "Notify Me" VIP early access email subscription.
- **Shop by Category:** Rapid silhouette navigation.
- **Personalized Recommendations:** Rule-based engine displaying *"Trending in Your Style"* and *"Complete the Look"*.
- **Brand Manifesto:** Editorial story highlighting 240+ GSM French Terry fabric, zero-collar-sag guarantee, and original artist illustrations.
- **Newsletter & Footer:** Complete working legal and customer care links (Shipping Policy, 7-Day Returns, Privacy, Terms, Tax Invoices).

### 3.4 Advanced Product Catalog (`/shop`)
- **Multi-Faceted Filtering:**
  - Filter by Category (Oversized, Regular, Anime, Cyberpunk, Hoodies, Sweatshirts)
  - Filter by Collection (Oversized Edit, Graphic Universe, Essentials, Limited Drops)
  - Filter by Size (`S`, `M`, `L`, `XL`, `XXL`)
  - Filter by Drop Type (`New Drop`, `Bestseller`, `Limited Run`)
- **Multi-Criteria Sorting:**
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Popularity & Highest Rated
- **URL Synchronization:** All active filters, search queries, and sorting parameters persist in URL query parameters.
- **Responsive Drawer:** Dedicated slide-out drawer on mobile devices with live filter count and reset buttons.

### 3.5 Premium Product Detail Page (`/product/[slug]`)
- **High-Definition Gallery:** Primary display with hover zoom and multi-image thumbnail selector.
- **Variant Matrix:** Selectable sizes and colorways with real-time variant stock indicators (`In Stock`, `Only X Left`, `Out of Stock`).
- **Technical Garment Specs:** Detailed breakdown of fabric weight (GSM), cut/silhouette, composition, and washing instructions.
- **Interactive Size Guide Modal:** Switchable measurements (Inches vs. CM) for chest width, length, shoulder drop, and sleeve.
- **Pincode Delivery Check:** Live Indian PIN code checker verifying express delivery timelines.
- **Verified Customer Reviews:** Star rating breakdown, verified purchase badges, and inline review submission.
- **Complete the Look:** Dynamic similar product recommendations.

### 3.6 Shopping Bag & Checkout (`/cart`, `/checkout`)
- **Free Shipping Progress Meter:** Dynamic visual progress bar (Free express delivery on orders $\ge$ ₹1,499).
- **Coupon System:** Server-side coupon validator supporting percentage and flat discounts (`BUILD10` for 10% off, `GENZ15` for 15% off, `FREESHIP` for shipping waiver).
- **Secure Address Form:** Comprehensive shipping inputs (Flat/House, Area, City, State, 6-digit PIN code, Phone number) with Zod validation.
- **Dual Payment Channels:** Instant Razorpay online payment or Cash on Delivery.

### 3.7 Order Management & Tracking (`/order-success/[orderNumber]`, `/track`)
- **Order Confirmation:** Instant order receipt with timestamped fulfillment status timeline.
- **Printable Tax Invoice:** Formatted GST-compliant tax receipt ready for download or printing.
- **Self-Service Actions:** One-click order cancellation for pending orders, or return request initiation for delivered pieces.
- **Courier Radar:** Dedicated `/track` page allowing anyone to track their package by order ID or Delhivery AWB number.

---

## 🛡️ 4. Advanced Admin Command Center (`/admin`)

The admin dashboard is a full-fledged operations center for managing the streetwear label without touching code:

1. **Overview & Analytics:**
   - Real-time KPI cards: Total Revenue, Total Orders, Average Order Value (AOV), Low Stock Alerts.
   - Order lifecycle distribution (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled).
   - Recent orders log with quick link to invoices.
2. **Product Catalog Manager:**
   - Add new streetwear garments (Title, Base Price, Compare Price, GSM, Fit, Description, Image URL, Category, Collection).
   - Automatic SKU generation and multi-size variant creation (`S` to `XXL`).
   - One-click deletion and archiving.
3. **Live Inventory Control:**
   - Variant-level stock visibility across all sizes and colorways.
   - Low-stock warnings (flagging items with $\le 5$ units).
   - Inline restock actions (`+10 Restock`, `-5 Deduct`).
4. **Order Fulfillment Pipeline:**
   - Filter orders by status.
   - Advance orders through lifecycle: `CONFIRMED` $\to$ `PROCESSING` $\to$ `SHIPPED` $\to$ `DELIVERED`.
   - Cancellation and refund status management.
5. **Shipping & Logistics:**
   - Assign shipping partner (Delhivery Express).
   - Generate and attach Air Waybill (AWB) tracking numbers.
6. **Storefront CMS Builder:**
   - Live update the infinite scrolling marquee banner text.
   - Configure the next limited drop countdown (Title, Subtitle, Target Launch Date).
   - Immediate live storefront updates without redeploying.
7. **Coupons & Promotions:**
   - Create percentage or flat discount codes.
   - Configure minimum order values and delete inactive promo codes.
8. **Store Settings Manager (Section 27):**
   - Brand title, base currency (`INR (₹)`), support email, contact phone, studio address.
   - Free shipping threshold (₹1,499), standard shipping fee, low stock alert threshold, return window (7 days), and Cash on Delivery toggle.

---

## 📧 5. Transactional Email & Notifications (Section 28)

Built-in notification dispatcher (`src/lib/email/index.ts`):
- **Welcome Notification:** Dispatched upon customer registration containing a 10% discount promo code (`BUILD10`).
- **Order Confirmation:** Dispatched upon checkout with an itemized table of ordered silhouettes, sizes, quantities, and GST total.
- **Shipping & Tracking Notification:** Dispatched when an administrator advances an order to `SHIPPED` and attaches a courier AWB tracking code.

---

## 🔍 6. SEO & Performance Optimizations (Section 25)

- **Dynamic Sitemap:** `src/app/sitemap.ts` generates dynamic XML sitemaps for the home page, product catalog, customer accounts, and all individual product pages.
- **Search Engine Directive:** `src/app/robots.ts` allows indexation of all product pages while restricting private admin/account directories.
- **Edge Middleware:** Security headers applied globally.

---

## 🧪 7. Automated Verification Test Suite (Sections 29 & 30)

Run the automated test suite verifying database integrity, authentication, pricing calculations, coupon logic, and inventory concurrency:

```bash
npm test
```

### Test Suite Execution Output
```
========================================================
⚡ RUNNING BUILD CLOTHING PRODUCTION VERIFICATION SUITE ⚡
========================================================

  ✓ [PASS] Database seeded with categories (Found: 6)
  ✓ [PASS] Catalog contains streetwear releases (Found: 8)
  ✓ [PASS] Product "NEO TOKYO RECON OVERSIZED TEE" has multi-size variants (Found: 10)
  ✓ [PASS] Variant stock levels are strictly positive numbers
  ✓ [PASS] Default Admin user exists in database
  ✓ [PASS] Admin password hash verifies correctly with bcrypt
  ✓ [PASS] JWT Token encodes and verifies ADMIN role
  ✓ [PASS] Orders under ₹1,499 correctly charge standard ₹99 shipping
  ✓ [PASS] Orders ₹1,499 and above unlock free shipping (₹0)
  ✓ [PASS] Coupon BUILD10 is active with 10% discount
  ✓ [PASS] Coupon FREESHIP is active
  ✓ [PASS] Inventory accurately decrements upon purchase (Was: 12, Now: 11)

--------------------------------------------------------
TOTAL TESTS: 12 | PASSED: 12 | FAILED: 0
--------------------------------------------------------
```

---

## 🚀 8. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested on v24.14.0)
- npm 9+

### Quick Start

```bash
# 1. Clone the repository and navigate into the directory
cd "Clothing Brand"

# 2. Install dependencies
npm install

# 3. Setup environment variables (pre-configured)
cp .env.example .env

# 4. Initialize and push database schema
npx prisma db push

# 5. Seed database with premium streetwear catalog & users
npx tsx prisma/seed.ts

# 6. Run automated tests
npm test

# 7. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 9. Production Deployment Guide (Vercel & PostgreSQL)

1. **Database:** Create a managed PostgreSQL database on Supabase, Neon, or Railway.
2. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set your production environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A secure 64-character random key.
   - `NEXT_PUBLIC_APP_URL`: Your live domain (e.g. `https://buildclothing.com`).
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Live Razorpay Key ID.
   - `RAZORPAY_KEY_SECRET`: Live Razorpay Secret.
4. Deploy with Vercel or run:
   ```bash
   npm run build
   npm run start
   ```
