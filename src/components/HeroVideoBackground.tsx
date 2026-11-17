"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX, ChevronDown } from "lucide-react";

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const toggleAudio = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById("story-categories");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[100vh] min-h-[640px] overflow-hidden flex flex-col justify-between text-[#F5F3EE]">
      {/* =========================================================================
          1. FULL-SCREEN VIDEO BACKGROUND (100% WIDTH x 100VH HEIGHT)
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none select-none">
        {/* High-Quality Poster Image Fallback while video loads */}
        <img
          src="/images/campaign/build-series-navy.jpg"
          alt="BUILD CLOTHING Campaign Poster"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Cinematic Campaign Video playing continuously in background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
        >
          <source src="/videos/build-promo.mp4" type="video/mp4" />
        </video>

        {/* =========================================================================
            5. SOPHISTICATED GRADIENT OVERLAYS
            Darkening on left and bottom for text readability, keeping models illuminated
            ========================================================================= */}
        {/* Left-to-right editorial darkening for headline contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent/10" />

        {/* Bottom-to-top darkening for specs and smooth transition into next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/35" />

        {/* Subtle top vignette for transparent navbar readability */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Top Spacer to account for transparent fixed navbar height (80px) */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />

      {/* =========================================================================
          3. HERO CONTENT OVER VIDEO
          Intelligently positioned on left side so models & back print stay visible
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto">
        <div className="max-w-2xl flex flex-col justify-center space-y-6">
          {/* Subtle Technical Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#D8FF36] text-[#151515] font-mono text-[11px] sm:text-xs px-2.5 py-1 tracking-widest uppercase font-bold shadow-md">
              <span className="w-1.5 h-1.5 bg-[#151515] rounded-full animate-ping" />
              OFFICIAL 2026 CAMPAIGN
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-[#D8FF36] tracking-widest uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/15">
              THE CORE SERIES
            </span>
          </div>

          {/* Monumental Main Heading per exact specification */}
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-[#AAAAAA] uppercase tracking-[0.2em] mb-2 drop-shadow">
              BUILD CLOTHING // AUTUMN-WINTER
            </span>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[104px] tracking-tight text-white uppercase select-none leading-[0.88] drop-shadow-2xl">
              BUILT FOR <br />
              <span className="text-[#D8FF36]">THE DIFFERENT.</span>
            </h1>
          </div>

          {/* Supporting Text per exact specification */}
          <p className="font-sans text-base sm:text-xl text-[#F5F3EE] max-w-lg leading-relaxed drop-shadow font-normal">
            Premium streetwear. Bold identity. <br className="hidden sm:inline" />
            Wear what defines you.
          </p>

          {/* Streetwear Specifications */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-[#D4D0C8]">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/15 text-[#D8FF36] font-bold">
              240 GSM HEAVY COMBED COTTON
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 hidden sm:inline-block">
              OVERSIZED BOXY FIT
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 hidden sm:inline-block">
              BRUTALIST ARCHITECTURE PRINT
            </span>
          </div>

          {/* CTA Buttons per exact specification */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center bg-[#D8FF36] text-[#151515] font-mono text-xs sm:text-sm font-bold px-8 py-4 uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-[#151515] shadow-2xl gap-2 hover:scale-[1.02]"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/custom-print"
              className="group inline-flex items-center justify-center bg-black/60 backdrop-blur-md text-[#F5F3EE] font-mono text-xs sm:text-sm font-bold px-8 py-4 uppercase tracking-widest border border-white/30 hover:border-white hover:bg-white/20 transition-all gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#D8FF36] animate-pulse" />
              <span>CUSTOM PRINT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM BAR: SCROLL CUE & AUDIO TOGGLE
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 flex items-center justify-between">
        {/* Scroll Indicator */}
        <button
          type="button"
          onClick={scrollToContent}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#AAAAAA] hover:text-[#D8FF36] transition-colors focus:outline-none"
        >
          <span>EXPLORE ARCHIVE</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D8FF36]" />
        </button>

        {/* Audio Toggle (Mute/Unmute) */}
        <button
          type="button"
          onClick={toggleAudio}
          className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md text-[#F5F3EE] hover:text-[#D8FF36] border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-sm shadow-md"
          title={isMuted ? "Unmute campaign audio" : "Mute campaign audio"}
          aria-label={isMuted ? "Unmute campaign audio" : "Mute campaign audio"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#AAAAAA]" />
              <span className="hidden sm:inline">AUDIO: MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#D8FF36]" />
              <span className="hidden sm:inline text-[#D8FF36]">AUDIO: ON</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
