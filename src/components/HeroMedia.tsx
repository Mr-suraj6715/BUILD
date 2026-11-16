"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

export default function HeroMedia() {
  const [activeMedia, setActiveMedia] = useState<"video" | "image">("video");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="relative z-10 w-full aspect-[4/5] bg-[#1E1E1E] overflow-hidden shadow-2xl group border border-[#333333]">
      {/* Media: Video or High-Res Still */}
      {activeMedia === "video" ? (
        <video
          ref={videoRef}
          src="/videos/build-promo.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src="/images/campaign/build-series-navy.jpg"
          alt="The BUILD Series Core T-Shirt Collection"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
      )}

      {/* Subtle Dark Gradient Overlay at Top & Bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

      {/* Technical Watermark Badges (Top Left) */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
        <span className="bg-[#151515]/90 backdrop-blur-md text-[#F5F3EE] font-mono text-[10px] px-2.5 py-1 tracking-widest uppercase border border-white/10 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF36] animate-pulse" />
          CORE 2026 // THE BUILD SERIES
        </span>
        <span className="bg-[#D8FF36] text-[#151515] font-mono text-[10px] px-2.5 py-0.5 uppercase tracking-wider font-bold">
          240 GSM HEAVYWEIGHT COTTON
        </span>
      </div>

      {/* Media Type Switcher & Controls (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
        <button
          type="button"
          onClick={() => setActiveMedia(activeMedia === "video" ? "image" : "video")}
          className="bg-black/75 backdrop-blur-md text-white hover:text-[#D8FF36] text-[10px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider border border-white/20 transition-colors"
        >
          {activeMedia === "video" ? "STILL" : "PROMO REEL"}
        </button>

        {activeMedia === "video" && (
          <>
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 bg-black/75 backdrop-blur-md text-white hover:text-[#D8FF36] border border-white/20 transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 bg-black/75 backdrop-blur-md text-white hover:text-[#D8FF36] border border-white/20 transition-colors"
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D8FF36]" />}
            </button>
          </>
        )}
      </div>

      {/* Bottom Information Pill */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <div>
          <span className="font-mono text-[9px] text-[#D8FF36] tracking-widest uppercase block">
            OFFICIAL CAMPAIGN
          </span>
          <span className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight block">
            BUILDING A BETTER TOMORROW
          </span>
        </div>
        <span className="bg-[#D8FF36] text-[#151515] font-display text-base sm:text-lg px-2.5 py-0.5 font-bold shadow-md shrink-0">
          DROP 01
        </span>
      </div>
    </div>
  );
}
