"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Robust browser autoplay guarantee for Chrome, Edge, Safari, Firefox
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict muted and inline settings required by browser autoplay policies
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");

    const startPlayback = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: retry on user touch or interaction
          const onUserGesture = () => {
            video.play().catch(() => { });
            window.removeEventListener("touchstart", onUserGesture);
            window.removeEventListener("click", onUserGesture);
            window.removeEventListener("scroll", onUserGesture);
          };
          window.addEventListener("touchstart", onUserGesture, { once: true, passive: true });
          window.addEventListener("click", onUserGesture, { once: true });
          window.addEventListener("scroll", onUserGesture, { once: true, passive: true });
        });
      }
    };

    startPlayback();
    video.addEventListener("canplay", startPlayback);
    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("loadedmetadata", startPlayback);

    // Ensure continuous loop without black frames
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => { });
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("canplay", startPlayback);
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById("story-categories");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero relative w-full h-[100vh] min-h-[640px] overflow-hidden flex flex-col justify-between text-[#F5F3EE] bg-[#080808]"
      style={{ isolation: "isolate" }}
      aria-label="Hero Fashion Campaign"
    >
      {/* =========================================================================
          1. REAL FULL-SCREEN HTML5 BACKGROUND VIDEO (AUTOPLAY, MUTED, LOOP)
          Covering 100% width and 100vh height behind website content
          ========================================================================= */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        poster="/images/campaign/build-series-navy.jpg"
        aria-hidden="true"
        tabIndex={-1}
        className="hero-video absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none"
      >
        <source src="/videos/build.mp4" type="video/mp4" />
        <source src="/videos/build-campaign.mp4" type="video/mp4" />
        <source src="/videos/build-promo.mp4" type="video/mp4" />
      </video>

      {/* =========================================================================
          2. EDITORIAL CINEMATIC OVERLAY (Z-INDEX: 1)
          Left-to-right gradient provides contrast for text while keeping models visible
          ========================================================================= */}
      <div
        className="hero-overlay absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 45%, rgba(0,0,0,0.30) 100%)",
        }}
      />
      {/* Seamless transition into bottom section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 40%, transparent 100%)",
        }}
      />

      {/* Spacer to push hero content below transparent fixed navbar (64px mobile, 80px desktop) */}
      <div className="h-16 lg:h-20 w-full shrink-0 relative z-[2]" aria-hidden="true" />

      {/* =========================================================================
          3. HERO CONTENT OVER MOVING VIDEO (Z-INDEX: 2)
          ========================================================================= */}
      <div className="hero-content relative z-[2] w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 my-auto">
        <div className="max-w-2xl flex flex-col justify-center space-y-4 sm:space-y-6">
          {/* Monumental Main Heading */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[104px] tracking-tight text-white uppercase select-none leading-[0.9] sm:leading-[0.88] drop-shadow-2xl">
              BUILT FOR <br />
              <span className="text-[#D8FF36]">THE DIFFERENT</span>
            </h1>
          </div>

          {/* Supporting Text */}
          <p className="font-sans text-sm sm:text-lg md:text-xl text-[#F5F3EE] max-w-lg leading-relaxed drop-shadow font-normal">
            Premium streetwear. Bold identity. <br className="hidden sm:inline" />
            Wear what defines you.
          </p>

          {/* Streetwear Specifications */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs font-mono text-[#D4D0C8]">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/15 text-[#D8FF36] font-bold">
              240 GSM HEAVY COMBED COTTON
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 hidden sm:inline-block">
              OVERSIZED BOXY FIT
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 hidden md:inline-block">
              BRUTALIST ARCHITECTURE PRINT
            </span>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center bg-[#D8FF36] text-[#151515] font-mono text-xs sm:text-sm font-bold px-6 sm:px-8 py-3.5 sm:py-4 uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-[#151515] shadow-2xl gap-2 hover:scale-[1.02]"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/custom-print"
              className="group inline-flex items-center justify-center bg-black/60 backdrop-blur-md text-[#F5F3EE] font-mono text-xs sm:text-sm font-bold px-6 sm:px-8 py-3.5 sm:py-4 uppercase tracking-widest border border-white/30 hover:border-white hover:bg-white/20 transition-all gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#D8FF36] animate-pulse" />
              <span>CUSTOM PRINT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM BAR: SCROLL CUE (Z-INDEX: 2)
          ========================================================================= */}
      <div className="relative z-[2] w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={scrollToContent}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#AAAAAA] hover:text-[#D8FF36] transition-colors focus:outline-none"
        >
          <span>EXPLORE ARCHIVE</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D8FF36]" />
        </button>
      </div>
    </section>
  );
}
