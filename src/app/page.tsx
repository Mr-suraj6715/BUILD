import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Marquee from "@/components/Marquee";
import HomeTrendingTabs from "@/components/HomeTrendingTabs";
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
          SECTION 03 — CINEMATIC HERO SECTION
          ========================================================================= */}
      <section className="relative w-full bg-white overflow-hidden border-b border-[#E8E5DE]">
        {/* Subtle Architectural Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-black/5"
                />
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
                  DROP 04 LIVE // ARCHIVE 2025
                </span>
                <span className="font-mono text-xs text-[#666666] tracking-wider uppercase bg-[#F0EEE9] px-2 py-1">
                  [ EDITION OF 500 PIECES ONLY ]
                </span>
              </div>

              {/* Main Monumental Headline */}
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#888888] uppercase tracking-widest mb-1">
                  SPEC: TOKYO EXPERIMENTAL LAB
                </span>
                <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl tracking-tight text-[#151515] uppercase select-none leading-[0.88]">
                  BUILT <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#151515] via-[#444444] to-[#536500]">
                    DIFFERENT.
                  </span>
                </h1>
              </div>

              {/* Body Description with Precision Specs */}
              <p className="font-sans text-base sm:text-lg text-[#555555] max-w-xl leading-relaxed">
                Not made to fit in. Made to stand out. 280 GSM luxury combed organic cotton
                engineered in Tokyo and custom-crafted for the next generation of streetwear
                purists and graphic anarchists.
              </p>

              {/* Primary CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center bg-[#151515] text-[#F5F3EE] font-mono text-xs font-bold px-6 py-4 uppercase tracking-widest transition-all duration-150 hover:bg-[#D8FF36] hover:text-[#151515] shadow-md gap-2"
                >
                  <span>SHOP THE COLLECTION</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/custom-print"
                  className="group inline-flex items-center justify-center bg-white text-[#151515] font-mono text-xs font-bold px-6 py-4 uppercase tracking-widest border border-[#E8E5DE] shadow-sm hover:bg-[#F0EEE9] transition-all gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D8FF36]" />
                  <span>CREATE YOUR OWN</span>
                  <span className="font-mono text-[10px] bg-[#F0EEE9] px-1.5 py-0.5 text-[#555555] group-hover:text-black">
                    LAB
                  </span>
                </Link>
              </div>

              {/* Real-time Live Metrics Strip */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg bg-[#F5F3EE] border border-[#E8E5DE] p-4">
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-[#151515]">500</span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#666666] uppercase">
                    Numbered Run
                  </span>
                </div>
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-[#151515]">48H</span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#666666] uppercase">
                    Global Dispatch
                  </span>
                </div>
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-[#151515]">1200</span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#666666] uppercase">
                    DPI Kornit DTG
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Raw Streetwear Editorial Visual Layering */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              {/* Backing Architectural Accent Plate */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-[#F0EEE9] -z-0 border border-[#E8E5DE]" />
              <div className="absolute -bottom-3 -left-3 w-28 h-28 bg-[#D8FF36]/30 -z-0" />

              {/* Primary Hero Image */}
              <div className="relative z-10 w-full aspect-[4/5] bg-[#E8E5DE] overflow-hidden shadow-xl group border border-[#D4D0C8]">
                <img
                  src="/images/stitch/hero-model.jpg"
                  alt="Editorial lookbook streetwear models in oversized graphic t-shirts"
                  className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* High-Fashion Watermark & Technical Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
                  <span className="bg-[#151515]/90 backdrop-blur-md text-[#F5F3EE] font-mono text-[10px] px-2 py-0.5 tracking-widest uppercase">
                    FIG. 01 — DROP 04
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-[#151515] font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    RAW ORGANIC 280 GSM
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#D8FF36] text-[#151515] font-display text-xl px-3 py-1 shadow-md">
                  TOKYO LAB
                </div>
              </div>

              {/* Floating Secondary Detail Spec Card */}
              <div className="absolute -bottom-6 -left-4 z-20 hidden sm:flex items-center gap-3 bg-[#151515] text-[#F5F3EE] p-3 shadow-xl max-w-xs border border-[#333333]">
                <div className="w-12 h-12 bg-[#262626] shrink-0 overflow-hidden">
                  <img
                    src="/images/stitch/fabric-texture.jpg"
                    alt="Macro 280 GSM combed cotton weave"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[#D8FF36] font-bold">
                    TACTILE TEXTURE
                  </span>
                  <span className="font-sans text-xs text-[#AAAAAA] truncate">
                    Zero shrinkage pre-washed yarn
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — INFINITE TYPOGRAPHY MARQUEE
          ========================================================================= */}
      <Marquee />

      {/* =========================================================================
          SECTION 05 — FEATURED COLLECTIONS (Bento Asymmetrical Grid)
          ========================================================================= */}
      <section className="w-full bg-[#FBF9F4] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#D4D0C8] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#666666] uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#151515]" />
              CATALOG ARCHIVE // 2025
            </div>
            <h2 className="font-display text-4xl sm:text-5xl uppercase font-black text-[#151515] mt-1">
              CURATED COLLECTIONS
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs font-bold text-[#151515] uppercase tracking-widest flex items-center gap-1.5 hover:text-[#536500] hover:underline underline-offset-4 group"
          >
            <span>VIEW ENTIRE VAULT</span>
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
                  Engineered drape with thick 1.25&quot; neck-ribbing that stays crisp after 100+ washes.
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
                  Subversive graphics, cyber-nihilism, and distorted Japanese typography hits.
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
      </section>

      {/* =========================================================================
          SECTION 06 — TRENDING PRODUCTS (Modern 4-Column Product Grid with Tabs)
          ========================================================================= */}
      <section className="w-full bg-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-y border-[#D4D0C8]">
        <div className="max-w-7xl mx-auto">
          <HomeTrendingTabs products={featuredProducts} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — CUSTOM PRINT BANNER (Major Brand Feature)
          ========================================================================= */}
      <section className="w-full bg-[#151515] text-[#F5F3EE] px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden border-b border-[#262626]">
        {/* Atmospheric Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D8FF36]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Realistic Mockup Display */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full aspect-[4/3] bg-[#1D1C16] relative overflow-hidden shadow-2xl p-6 flex items-center justify-center border border-[#333333]">
              {/* Blueprint Grid Crosshairs */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* 3D Garment Mockup Photo */}
              <img
                src="/images/stitch/custom-mockup.png"
                alt="3D Heavyweight T-Shirt Mockup Canvas"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />

              {/* Calibration Labels */}
              <div className="absolute top-4 left-4 font-mono text-[10px] text-[#D8FF36]">
                PRINT LAB CALIBRATION [1200 DPI]
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#888888]">
                CANVAS: 400 × 500 MM
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-4 left-6 bg-[#D8FF36] text-[#151515] font-mono text-xs px-4 py-1.5 shadow-lg font-bold">
              SINGLE PIECE OR 10,000+ UNITS
            </div>
          </div>

          {/* Right: Technical Specification & Customizer Invitation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D8FF36] uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#D8FF36]" />
              BUILD STUDIO PROTOCOL // STUDIO ENGINE
            </div>

            <h2 className="font-display text-5xl sm:text-7xl tracking-tight uppercase leading-none text-white">
              YOUR DESIGN. <br />
              <span className="text-[#D8FF36]">OUR PRINT.</span>
            </h2>

            <p className="font-sans text-base text-[#AAAAAA] leading-relaxed">
              Bring your imagination to life. Upload your artwork, choose from ultra-heavyweight
              Japanese cotton blanks, and create something that is completely yours. Single piece
              prints or full collection batches with zero minimums.
            </p>

            {/* Feature Spec Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">
                  No Minimum Orders
                </span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">
                  Ultra-HD Kornit DTG
                </span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">
                  Puff &amp; Screenprint
                </span>
              </div>
              <div className="bg-[#1D1C16] p-3 flex items-center gap-2.5 border border-[#2E2D27]">
                <CheckCircle2 className="w-4 h-4 text-[#D8FF36] shrink-0" />
                <span className="font-mono text-xs uppercase text-[#E8E5DE]">
                  Dispatched in 48H
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/custom-print"
                className="inline-flex items-center gap-3 bg-[#D8FF36] text-[#151515] font-display text-xl px-8 py-4 uppercase tracking-wider hover:bg-white transition-all shadow-lg hover:translate-x-1"
              >
                <span>DESIGN YOUR T-SHIRT</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — HOW IT WORKS (Clean 4-Step Visual Flow)
          ========================================================================= */}
      <section className="w-full bg-[#F0EEE9] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#D4D0C8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold text-[#536500] uppercase tracking-widest">
              // ARCHITECTURAL PIPELINE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#151515] uppercase mt-1">
              HOW THE LAB OPERATES
            </h2>
            <p className="font-sans text-sm text-[#666666] mt-2">
              Zero complexity. Unmatched industrial garment finish.
            </p>
          </div>

          {/* 4 Architectural Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 01 */}
            <div className="bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-[#E8E5DE]">
              <div>
                <span className="font-display text-4xl text-[#536500]/40 block">01</span>
                <h3 className="font-mono text-sm font-bold text-[#151515] uppercase mt-3">
                  CHOOSE YOUR SILHOUETTE
                </h3>
                <p className="font-sans text-xs text-[#666666] mt-2 leading-relaxed">
                  Select between Boxy Oversized, Standard Japanese Cut, or Heavyweight Long Sleeve
                  in raw organic dyes.
                </p>
              </div>
              <div className="mt-6 pt-2 bg-[#F5F3EE] px-3 py-1 font-mono text-[10px] text-[#747878] uppercase">
                BLANKS: 240 - 320 GSM
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-[#E8E5DE]">
              <div>
                <span className="font-display text-4xl text-[#536500]/40 block">02</span>
                <h3 className="font-mono text-sm font-bold text-[#151515] uppercase mt-3">
                  UPLOAD YOUR DESIGN
                </h3>
                <p className="font-sans text-xs text-[#666666] mt-2 leading-relaxed">
                  Drag &amp; drop high-res PNG, PSD, or vector files. Or browse our open-source
                  archive of curated typography hits.
                </p>
              </div>
              <div className="mt-6 pt-2 bg-[#F5F3EE] px-3 py-1 font-mono text-[10px] text-[#747878] uppercase">
                VECTOR / 300+ DPI
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-[#E8E5DE]">
              <div>
                <span className="font-display text-4xl text-[#536500]/40 block">03</span>
                <h3 className="font-mono text-sm font-bold text-[#151515] uppercase mt-3">
                  CUSTOMIZE YOUR PRINT
                </h3>
                <p className="font-sans text-xs text-[#666666] mt-2 leading-relaxed">
                  Calibrate scale, print coordinates (Chest, Oversized Back, Nape, Sleeves), and
                  select ink tactility.
                </p>
              </div>
              <div className="mt-6 pt-2 bg-[#F5F3EE] px-3 py-1 font-mono text-[10px] text-[#747878] uppercase">
                FINISH: FLAT / 3D PUFF
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border border-[#E8E5DE]">
              <div>
                <span className="font-display text-4xl text-[#536500]/40 block">04</span>
                <h3 className="font-mono text-sm font-bold text-[#151515] uppercase mt-3">
                  WE PRINT &amp; DELIVER
                </h3>
                <p className="font-sans text-xs text-[#666666] mt-2 leading-relaxed">
                  Crafted on industrial Kornit DTG printers in Tokyo and delivered in biodegradable
                  streetwear packaging.
                </p>
              </div>
              <div className="mt-6 pt-2 bg-[#F5F3EE] px-3 py-1 font-mono text-[10px] text-[#747878] uppercase">
                DISPATCH: 48 HOURS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — CREATOR SHOWCASE (Produced in our Studio)
          ========================================================================= */}
      <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#D4D0C8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#D4D0C8] pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#536500] uppercase tracking-widest">
                // PRODUCED IN OUR STUDIO
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#151515] uppercase mt-1">
                CREATOR SHOWCASE
              </h2>
            </div>
            <Link
              href="/custom-print"
              className="inline-flex items-center gap-2 bg-[#151515] text-[#F5F3EE] px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-[#D8FF36] hover:text-[#151515] transition-colors"
            >
              <span>EXPLORE CUSTOM PRINTING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Community Reel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Creator Item 1 */}
            <div className="group relative bg-[#F5F3EE] overflow-hidden shadow-sm border border-[#E8E5DE]">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/images/stitch/creator-1.jpg"
                  alt="Custom Tour Merch Streetwear"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-[#F5F3EE]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#151515] uppercase">
                    @KAI.STUDIOS
                  </span>
                  <span className="font-mono text-[10px] bg-[#E4E2DD] px-1.5 py-0.5 uppercase">
                    DTG + PUFF
                  </span>
                </div>
                <p className="font-sans text-xs text-[#666666] mt-1.5">
                  Tour merch capsule for underground electronic record release. Run of 120 pieces.
                </p>
              </div>
            </div>

            {/* Creator Item 2 */}
            <div className="group relative bg-[#F5F3EE] overflow-hidden shadow-sm border border-[#E8E5DE]">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/images/stitch/creator-2.jpg"
                  alt="Custom Runway Botanical Graphic T-Shirt"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-[#F5F3EE]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#151515] uppercase">
                    @NEO.ARCHIVE
                  </span>
                  <span className="font-mono text-[10px] bg-[#E4E2DD] px-1.5 py-0.5 uppercase">
                    1-PIECE CUSTOM
                  </span>
                </div>
                <p className="font-sans text-xs text-[#666666] mt-1.5">
                  Single experimental prototype printed in Tokyo Lab for personal runway look.
                </p>
              </div>
            </div>

            {/* Creator Item 3 */}
            <div className="group relative bg-[#F5F3EE] overflow-hidden shadow-sm border border-[#E8E5DE]">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/images/stitch/creator-3.jpg"
                  alt="Custom Silkscreen Symposium Staff Tee"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-[#F5F3EE]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#151515] uppercase">
                    @SYNTH.COLLECTIVE
                  </span>
                  <span className="font-mono text-[10px] bg-[#E4E2DD] px-1.5 py-0.5 uppercase">
                    6-COLOR SCREEN
                  </span>
                </div>
                <p className="font-sans text-xs text-[#666666] mt-1.5">
                  Exclusive staff shirts for Berlin design symposium. 280 GSM heavyweight blank.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — EDITORIAL LOOKBOOK (SHIBUYA CONCRETE)
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

          {/* Editorial Collage Layout */}
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
          DROP COUNTDOWN
          ========================================================================= */}
      <DropCountdown />

      {/* =========================================================================
          SECTION 11 — STUDIO MANIFESTO & BRAND STORY
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
                zero-shrinkage combed organic cotton, designed to survive a decade of daily wear,
                skate sessions, and late-night underground shows.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6 border-t border-[#D4D0C8]">
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold text-[#151515] uppercase tracking-wider">
                  KENJI TAKAHASHI
                </span>
                <span className="font-mono text-xs text-[#777777] uppercase">
                  HEAD OF GARMENT ARCHITECTURE // TOKYO LAB
                </span>
              </div>
              <div className="h-8 w-px bg-[#D4D0C8]" />
              <div className="font-mono text-xs font-bold text-[#536500] uppercase tracking-widest">
                AUTHENTIC // 280 GSM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — VIP DISPATCH LIST (Newsletter)
          ========================================================================= */}
      <section className="w-full bg-[#E4E2DD] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto bg-[#151515] text-[#F5F3EE] p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#333333]">
          {/* Subtle Flash */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8FF36]/10 -mr-10 -mt-10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D8FF36] uppercase">
                <span className="w-2 h-2 bg-[#D8FF36]" />
                VIP DISPATCH LIST
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-none font-black">
                GET FIRST ACCESS.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#AAAAAA]">
                New drops, exclusive designs, private discount codes, and unreleased samples from the
                BUILD underground archive.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
