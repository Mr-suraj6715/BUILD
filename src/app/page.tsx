import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, Tag, Flame } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Marquee from "@/components/Marquee";
import HomeTrendingTabs from "@/components/HomeTrendingTabs";
import StoryCategories from "@/components/StoryCategories";
import PriceZones from "@/components/PriceZones";
import TrustPerks from "@/components/TrustPerks";
import DropCountdown from "@/components/DropCountdown";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 60; // ISR cache 60s

async function getHomeData() {
  const [featuredProducts, collections, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
        collection: true,
      },
    }),
    prisma.collection.findMany({
      where: { isFeatured: true },
      take: 4,
    }),
    prisma.category.findMany({
      take: 6,
    }),
  ]);

  return {
    featuredProducts,
    collections,
    categories,
  };
}

export default async function HomePage() {
  const { featuredProducts, collections } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F4] text-[#1B1C19]">
      {/* =========================================================================
          SECTION 01 — ZARA-INSPIRED EDITORIAL CAMPAIGN HERO
          ========================================================================= */}
      <section className="relative w-full bg-[#151515] text-[#F5F3EE] overflow-hidden border-b border-[#262626]">
        {/* Subtle Architectural Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: High-Impact Typography & Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center z-10 space-y-6">
              {/* Overline Badge & Live Counter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#D8FF36] text-[#151515] font-mono text-xs px-2.5 py-1 tracking-widest uppercase font-bold">
                  <span className="w-1.5 h-1.5 bg-[#151515] rounded-full animate-ping" />
                  ZARA-STYLE EDITORIAL DROP // 2025
                </span>
                <span className="font-mono text-xs text-[#AAAAAA] tracking-wider uppercase bg-[#262626] px-2 py-1 border border-[#333333]">
                  [ LIMITED 500 PIECE RUN ]
                </span>
              </div>

              {/* Main Monumental Headline */}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#888888] uppercase tracking-widest mb-1">
                  COLLECTION 04: THE OVERSIZED ARCHIVE
                </span>
                <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl tracking-tight text-white uppercase select-none leading-[0.88]">
                  BUILT <br />
                  <span className="text-[#D8FF36]">DIFFERENT.</span>
                </h1>
              </div>

              {/* Body Description with Precision Specs */}
              <p className="font-sans text-base sm:text-lg text-[#CCCCCC] max-w-xl leading-relaxed">
                High-fashion editorial silhouettes meeting fast-fashion accessibility. 240–280 GSM
                luxury combed organic cotton, engineered with Tokyo drop-shoulders and crack-proof Kornit
                prints. Built for the streetwear purist.
              </p>

              {/* Primary CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center bg-[#D8FF36] text-[#151515] font-mono text-xs font-bold px-7 py-4 uppercase tracking-widest transition-all duration-150 hover:bg-white hover:text-[#151515] shadow-lg gap-2"
                >
                  <span>SHOP NEW DROPS</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/custom-print"
                  className="group inline-flex items-center justify-center bg-transparent text-[#F5F3EE] font-mono text-xs font-bold px-7 py-4 uppercase tracking-widest border border-white/30 hover:border-white hover:bg-white/10 transition-all gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D8FF36]" />
                  <span>CUSTOM PRINT LAB</span>
                </Link>
              </div>

              {/* Fast-Fashion Price Highlights (Zudio Anchor) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#AAAAAA]">
                <span className="bg-[#262626] px-2.5 py-1 text-[#D8FF36] font-bold">
                  TEES STARTING @ ₹999
                </span>
                <span>•</span>
                <span>FREE DELIVERY OVER ₹1,499</span>
                <span>•</span>
                <span>50% OFF CODE: SURAJ300</span>
              </div>
            </div>

            {/* Right Column: Zara-Style High-Fashion Model Imagery */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="absolute -top-3 -right-3 w-full h-full bg-[#262626] -z-0 border border-[#333333]" />
              <div className="absolute -bottom-3 -left-3 w-28 h-28 bg-[#D8FF36]/20 -z-0" />

              {/* Hero Photo Card */}
              <div className="relative z-10 w-full aspect-[4/5] bg-[#1E1E1E] overflow-hidden shadow-2xl group border border-[#333333]">
                <img
                  src="/images/stitch/hero-model.jpg"
                  alt="Streetwear models in oversized graphic t-shirts"
                  className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* Technical Watermark */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
                  <span className="bg-[#151515]/90 backdrop-blur-md text-[#F5F3EE] font-mono text-[10px] px-2 py-0.5 tracking-widest uppercase">
                    CAMPAIGN 04 // EDITORIAL
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-[#151515] font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">
                    280 GSM RAW ORGANIC
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#D8FF36] text-[#151515] font-display text-xl px-3 py-1 shadow-md">
                  TOKYO // NYC // BERLIN
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — H&M-INSPIRED STORY CATEGORIES RAIL
          ========================================================================= */}
      <StoryCategories />

      {/* =========================================================================
          SECTION 03 — ZUDIO-INSPIRED PRICE POINT SHOPPING ZONES
          ========================================================================= */}
      <PriceZones />

      {/* =========================================================================
          SECTION 04 — INFINITE STREETWEAR MARQUEE
          ========================================================================= */}
      <Marquee />

      {/* =========================================================================
          SECTION 05 — ZARA-INSPIRED TRENDING RUNWAY PRODUCT GRID
          ========================================================================= */}
      <section className="w-full bg-[#FBF9F4] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#D4D0C8]">
        <div className="max-w-7xl mx-auto">
          <HomeTrendingTabs products={featuredProducts} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — FEATURED COLLECTIONS (Editorial Asymmetrical Bento Grid)
          ========================================================================= */}
      <section className="w-full bg-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#D4D0C8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#D4D0C8] pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#666666] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#151515]" />
                T-SHIRT ARCHIVES // 2025
              </div>
              <h2 className="font-display text-4xl sm:text-5xl uppercase font-black text-[#151515] mt-1">
                CURATED CAPSULES
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-mono text-xs font-bold text-[#151515] uppercase tracking-widest flex items-center gap-1.5 hover:text-[#536500] hover:underline underline-offset-4 group"
            >
              <span>EXPLORE ALL T-SHIRTS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento 4-Card Asymmetrical Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Collection 01: The Oversized Edit (Span 7) */}
            <Link
              href="/shop?collection=oversized-edit"
              className="md:col-span-7 group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E5DE]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#E8E5DE] relative">
                <img
                  src="/images/stitch/collection-oversized.jpg"
                  alt="The Oversized Edit Streetwear Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] bg-white text-[#151515] px-2 py-1 font-bold">
                  [01] // CORE SILHOUETTE
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] text-[#D8FF36] uppercase tracking-widest">
                    DROPPED SHOULDERS // RELAXED COLLAR
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase text-white mt-0.5">
                    THE OVERSIZED EDIT
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#CCCCCC] line-clamp-1 mt-1">
                    Engineered boxy drape with thick 1.25&quot; neck-ribbing that stays crisp after 100+ washes.
                  </p>
                </div>
              </div>
            </Link>

            {/* Collection 02: Graphic Universe (Span 5) */}
            <Link
              href="/shop?collection=graphic-universe"
              className="md:col-span-5 group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E5DE]"
            >
              <div className="aspect-[16/10] md:aspect-auto md:h-full w-full overflow-hidden bg-[#E8E5DE] relative min-h-[260px]">
                <img
                  src="/images/stitch/collection-graphic.jpg"
                  alt="Graphic Universe Streetwear Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] bg-[#D8FF36] text-[#151515] px-2 py-1 font-bold">
                  [02] // HIGH IMPACT
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] text-[#D8FF36] uppercase tracking-widest">
                    SILKSCREEN &amp; GLITCH PRINTS
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase text-white mt-0.5">
                    GRAPHIC UNIVERSE
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#CCCCCC] line-clamp-1 mt-1">
                    Cyber-nihilism, Tokyo mecha schematics, and distorted Japanese typography hits.
                  </p>
                </div>
              </div>
            </Link>

            {/* Collection 03: Original Artwork (Span 5) */}
            <Link
              href="/shop?collection=original-artwork"
              className="md:col-span-5 group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E5DE]"
            >
              <div className="aspect-[16/10] md:aspect-auto md:h-full w-full overflow-hidden bg-[#E8E5DE] relative min-h-[260px]">
                <img
                  src="/images/stitch/collection-original.jpg"
                  alt="Original Artwork Streetwear Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] bg-white text-[#151515] px-2 py-1 font-bold">
                  [03] // COLLABORATIVE
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] text-[#D8FF36] uppercase tracking-widest">
                    TACTILE PUFF INK SERIES
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase text-white mt-0.5">
                    ORIGINAL ARTWORK
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#CCCCCC] line-clamp-1 mt-1">
                    Numbered capsules designed in conjunction with global underground digital artists.
                  </p>
                </div>
              </div>
            </Link>

            {/* Collection 04: Limited Drops (Span 7) */}
            <Link
              href="/shop?collection=limited-drops"
              className="md:col-span-7 group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E5DE]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#E8E5DE] relative">
                <img
                  src="/images/stitch/collection-drops.jpg"
                  alt="Limited Drops Streetwear Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[10px] bg-[#BA1A1A] text-white px-2 py-1 font-bold">
                  [04] // ARCHIVE ONLY
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] text-[#D8FF36] uppercase tracking-widest">
                    ONE-OFF RUNS // NEVER RESTOCKED
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase text-white mt-0.5">
                    LIMITED DROPS
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#CCCCCC] line-clamp-1 mt-1">
                    Every unit stamped with a unique cryptographic verification serial.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — CUSTOM PRINT STUDIO (Design Your Own Tee Canvas)
          ========================================================================= */}
      <section className="w-full bg-[#151515] text-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden border-b border-[#262626]">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D8FF36]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Realistic Mockup Display */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full aspect-[4/3] bg-[#1D1C16] relative overflow-hidden shadow-2xl p-6 flex items-center justify-center border border-[#333333]">
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              <img
                src="/images/stitch/custom-mockup.png"
                alt="3D Heavyweight T-Shirt Mockup Canvas"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />

              <div className="absolute top-4 left-4 font-mono text-[10px] text-[#D8FF36]">
                PRINT LAB CALIBRATION [1200 DPI]
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#888888]">
                CANVAS: 400 × 500 MM
              </div>
            </div>

            <div className="absolute -bottom-4 left-6 bg-[#D8FF36] text-[#151515] font-mono text-xs px-4 py-1.5 shadow-lg font-bold">
              STARTING AT ₹999 // SINGLE PIECE DISPATCH
            </div>
          </div>

          {/* Right: Technical Specification & Customizer Invitation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D8FF36] uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#D8FF36]" />
              BUILD STUDIO PROTOCOL // STUDIO ENGINE
            </div>

            <h2 className="font-display text-5xl sm:text-7xl tracking-tight uppercase leading-none text-white">
              YOUR ARTWORK. <br />
              <span className="text-[#D8FF36]">OUR TEE BLANKS.</span>
            </h2>

            <p className="font-sans text-base text-[#AAAAAA] leading-relaxed">
              Upload your artwork or graphic, choose from ultra-heavyweight 240–280 GSM Japanese
              cotton blanks, and customize print placement. Single custom tees or batch orders with zero minimums.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">Zero Minimums</span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">1200 DPI Kornit DTG</span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">Crack-Proof Inks</span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">Dispatched in 48H</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/custom-print"
                className="inline-flex items-center gap-3 bg-[#D8FF36] text-[#151515] font-display text-xl px-8 py-4 uppercase tracking-wider hover:bg-white transition-all shadow-lg hover:translate-x-1"
              >
                <span>LAUNCH CUSTOM TEE LAB</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — TRUST PERKS (ZARA & H&M QUALITY ASSURANCES)
          ========================================================================= */}
      <TrustPerks />

      {/* =========================================================================
          SECTION 09 — EDITORIAL LOOKBOOK (SHIBUYA CONCRETE)
          ========================================================================= */}
      <section
        id="lookbook"
        className="w-full bg-[#151515] text-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden border-b border-[#262626]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-[#333333] pb-4">
            <div>
              <span className="font-mono text-xs text-[#D8FF36] uppercase tracking-widest">
                // LOOKBOOK ARCHIVE VOL. 04
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase leading-none mt-1">
                SHIBUYA CONCRETE
              </h2>
            </div>
            <div className="font-mono text-xs text-[#888888] uppercase mt-2 md:mt-0">
              COORDINATES: 35.6580° N, 139.7016° E
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 relative aspect-[16/9] bg-[#1D1C16] overflow-hidden shadow-2xl border border-[#333333]">
              <img
                src="/images/stitch/lookbook-hero.jpg"
                alt="Shibuya Neon Alleyway Streetwear Editorial"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 font-display text-lg text-white bg-black/80 px-4 py-1">
                SCENE 04 // 02:40 AM
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="aspect-square bg-[#1D1C16] overflow-hidden shadow-xl border border-[#333333]">
                <img
                  src="/images/stitch/lookbook-detail.jpg"
                  alt="Heavyweight Ribbed Collar Streetwear Portrait"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="bg-[#1D1C16] p-6 border border-[#2E2D27]">
                <span className="font-mono text-xs text-[#D8FF36] uppercase tracking-widest font-bold">
                  CURATOR NOTES
                </span>
                <p className="font-sans text-xs sm:text-sm text-[#AAAAAA] mt-2 leading-relaxed">
                  Vol. 04 explores the friction between rigid urban architecture and unrestrained
                  graphic identity. Captured on 35mm film across Shibuya&apos;s industrial underpasses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — DROP COUNTDOWN
          ========================================================================= */}
      <DropCountdown />

      {/* =========================================================================
          SECTION 11 — BRAND MANIFESTO & STORY
          ========================================================================= */}
      <section
        id="story"
        className="w-full bg-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-20 border-b border-[#D4D0C8]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-[#E8E5DE] overflow-hidden shadow-xl border border-[#D4D0C8]">
              <img
                src="/images/stitch/brand-studio.jpg"
                alt="BUILD Textile Cutting and Garment Lab"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#151515] text-[#F5F3EE] p-5 shadow-lg border border-[#333333]">
              <div className="font-display text-2xl text-[#D8FF36]">EST. 2021</div>
              <div className="font-mono text-[10px] text-[#AAAAAA] uppercase">
                TOKYO // SOHO // MITTE
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="font-mono text-xs font-bold text-[#536500] uppercase tracking-widest">
              // STUDIO MANIFESTO
            </span>

            <h2 className="font-display text-5xl sm:text-7xl text-[#151515] uppercase leading-tight font-black">
              WEAR WHAT <br />
              YOU CREATE.
            </h2>

            <div className="space-y-4 font-sans text-base text-[#555555] leading-relaxed">
              <p>
                More than clothing. A canvas for your identity. Founded on the conviction that
                streetwear should never be dictated by ivory-tower fashion houses, BUILD merges
                brutalist industrial engineering with democratized apparel manufacturing.
              </p>
              <p>
                We don&apos;t manufacture disposable trends. Every single garment is woven from
                100% combed ringspun cotton, tested for zero-shrinkage, and hand-finished with our
                signature double-needle collar ribbing.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#151515] text-[#F5F3EE] hover:bg-[#D8FF36] hover:text-[#151515] font-mono text-xs font-bold px-6 py-3.5 uppercase tracking-widest transition-colors"
              >
                <span>EXPLORE THE ARCHIVE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — H&M-STYLE NEWSLETTER & MEMBER CLUB
          ========================================================================= */}
      <NewsletterForm />
    </div>
  );
}
