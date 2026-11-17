"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Sparkles,
  ArrowRight,
  Tv,
} from "lucide-react";

export default function HeroMedia() {
  const [activeMedia, setActiveMedia] = useState<"video" | "image">("video");
  const [aspectMode, setAspectMode] = useState<"16:9" | "4:5">("16:9");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  const videoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 15;
    setProgress((current / duration) * 100);

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    setCurrentTime(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
  };

  // Close theater modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsTheaterOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative z-10 w-full group">
        {/* Main Video/Media Container */}
        <div
          className={`relative w-full bg-[#101010] overflow-hidden shadow-2xl border border-[#333333] transition-all duration-500 ${
            aspectMode === "16:9" ? "aspect-video" : "aspect-[4/5]"
          }`}
        >
          {/* Media: 16:9 4K-Style Campaign Video or Editorial Still */}
          {activeMedia === "video" ? (
            <video
              ref={videoRef}
              src="/videos/build-promo.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <img
              src="/images/campaign/build-series-navy.jpg"
              alt="The BUILD Series Core T-Shirt Collection Campaign"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          )}

          {/* Cinematic Top & Bottom Shadow Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

          {/* Technical Watermark Badges (Top Left) */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-20 pointer-events-none">
            <span className="bg-[#151515]/90 backdrop-blur-md text-[#F5F3EE] font-mono text-[9px] sm:text-[10px] px-2.5 py-0.5 tracking-widest uppercase border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF36] animate-pulse" />
              BUILD CAMPAIGN // 16:9 CINEMA
            </span>
            <span className="bg-[#D8FF36] text-[#151515] font-mono text-[9px] sm:text-[10px] px-2.5 py-0.5 uppercase tracking-wider font-bold">
              BUILT DIFFERENT. // 240 GSM
            </span>
          </div>

          {/* Interactive Controls & Format Switchers (Top Right) */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 z-20">
            {/* Aspect Ratio Switcher */}
            <button
              type="button"
              onClick={() => setAspectMode(aspectMode === "16:9" ? "4:5" : "16:9")}
              title={`Switch aspect ratio (currently ${aspectMode})`}
              className="hidden sm:inline-flex items-center gap-1 bg-black/80 backdrop-blur-md text-[#CCCCCC] hover:text-white text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-wider border border-white/20 transition-colors"
            >
              <Tv className="w-3 h-3 text-[#D8FF36]" />
              <span>{aspectMode}</span>
            </button>

            {/* Media Type Switcher */}
            <button
              type="button"
              onClick={() => setActiveMedia(activeMedia === "video" ? "image" : "video")}
              className="bg-black/80 backdrop-blur-md text-white hover:text-[#D8FF36] text-[10px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider border border-white/20 transition-colors"
            >
              {activeMedia === "video" ? "STILL" : "PROMO REEL"}
            </button>

            {activeMedia === "video" && (
              <>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 bg-black/80 backdrop-blur-md text-white hover:text-[#D8FF36] border border-white/20 transition-colors"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 bg-black/80 backdrop-blur-md text-white hover:text-[#D8FF36] border border-white/20 transition-colors"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  title={isMuted ? "Turn sound on" : "Mute sound"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#D8FF36]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTheaterOpen(true)}
                  className="p-1.5 bg-black/80 backdrop-blur-md text-white hover:text-[#D8FF36] border border-white/20 transition-colors"
                  aria-label="Expand 16:9 Theater Mode"
                  title="Expand 16:9 Theater Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Title Bar & Timecode */}
          <div className="absolute bottom-3 left-3.5 right-3.5 z-20 flex items-end justify-between text-white pointer-events-none">
            <div>
              <span className="font-mono text-[9px] text-[#D8FF36] tracking-widest uppercase block font-bold">
                CORE T-SHIRT COLLECTION // SCENE BREAKDOWN
              </span>
              <span className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight block leading-tight">
                BUILDING A BETTER TOMORROW
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#AAAAAA] bg-black/80 px-2 py-0.5 border border-white/10 hidden sm:inline-block">
                {currentTime} / 0:15
              </span>
              <span className="bg-[#D8FF36] text-[#151515] font-display text-sm sm:text-base px-2.5 py-0.5 font-bold shadow-md shrink-0">
                DROP 01
              </span>
            </div>
          </div>

          {/* Playback Scrub/Progress Line */}
          {activeMedia === "video" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
              <div
                className="h-full bg-[#D8FF36] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Unmute Cue Pill on Desktop */}
        {activeMedia === "video" && isMuted && (
          <button
            type="button"
            onClick={toggleMute}
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] hover:text-[#D8FF36] transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D8FF36]" />
            <span>Click to enable official campaign audio</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          THEATER MODE MODAL (ULTRA 16:9 CINEMATIC VIEW)
          ========================================================================= */}
      {isTheaterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Modal Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-3 text-white">
            <div className="flex items-center gap-3">
              <span className="bg-[#D8FF36] text-[#151515] font-display text-lg px-2.5 py-0.5 font-bold uppercase">
                BUILD
              </span>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#CCCCCC]">
                CINEMATIC CAMPAIGN // 16:9 4K HERO EDITORIAL
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsTheaterOpen(false)}
              className="p-2 text-[#CCCCCC] hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close Theater Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 16:9 Cinema Screen */}
          <div className="w-full max-w-5xl aspect-video bg-black relative border border-white/20 shadow-2xl overflow-hidden">
            <video
              ref={theaterVideoRef}
              src="/videos/build-promo.mp4"
              autoPlay
              loop
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Scene Breakdown Timeline Guide */}
          <div className="w-full max-w-5xl mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-[10px] text-[#888888] uppercase">
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">01 // 0-2S</span>
              <span>Dark Concrete Intro</span>
            </div>
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">02 // 2-4S</span>
              <span>Chest Logo Texture</span>
            </div>
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">03 // 4-7S</span>
              <span>Urban Street Walk</span>
            </div>
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">04 // 7-10S</span>
              <span>Back Globe Graphic</span>
            </div>
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">05 // 10-13S</span>
              <span>High-Energy Run</span>
            </div>
            <div className="bg-[#1A1A1A] p-2 border border-white/10">
              <span className="text-[#D8FF36] block font-bold">06 // 13-15S</span>
              <span>Final Brand Moment</span>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="w-full max-w-5xl mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight">
              BUILT DIFFERENT. <span className="text-[#D8FF36]">THE CORE SERIES</span>
            </div>

            <Link
              href="/product/build-series-better-tomorrow-tee-navy"
              onClick={() => setIsTheaterOpen(false)}
              className="inline-flex items-center gap-2 bg-[#D8FF36] text-[#151515] font-mono text-xs font-bold px-6 py-3 uppercase tracking-widest hover:bg-white transition-colors"
            >
              <span>SHOP FEATURED MIDNIGHT NAVY TEE — ₹1,699</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
