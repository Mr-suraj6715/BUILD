"use client";

import React, { useRef, useState, useEffect } from "react";

export interface CustomArtworkState {
  url: string | null;
  fileName?: string;
  x: number; // percentage offset from center (-50 to 50)
  y: number; // percentage offset from center (-50 to 50)
  scale: number; // 0.3 to 2.0
  rotation: number; // -180 to 180 degrees
}

export interface CustomTextState {
  text: string;
  font: string; // "mono" | "sans" | "serif" | "display"
  color: string;
  fontSize: number; // 12 to 54
  x: number; // percentage offset from center (-50 to 50)
  y: number; // percentage offset from center (-50 to 50)
  rotation: number; // -180 to 180
}

interface GarmentModelProps {
  garmentId: string;
  view: "front" | "back";
  colorHex: string;
  placement: string;
  finish: string;
  frontArtwork: CustomArtworkState;
  backArtwork: CustomArtworkState;
  frontText: CustomTextState;
  backText: CustomTextState;
  showGuidelines?: boolean;
  onUpdateArtwork?: (side: "front" | "back", updates: Partial<CustomArtworkState>) => void;
  onUpdateText?: (side: "front" | "back", updates: Partial<CustomTextState>) => void;
  interactive?: boolean;
}

export default function GarmentModel({
  garmentId,
  view,
  colorHex,
  placement,
  finish,
  frontArtwork,
  backArtwork,
  frontText,
  backText,
  showGuidelines = true,
  onUpdateArtwork,
  onUpdateText,
  interactive = true,
}: GarmentModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDragItem, setActiveDragItem] = useState<"artwork" | "text" | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; origX: number; origY: number } | null>(null);

  const currentArtwork = view === "front" ? frontArtwork : backArtwork;
  const currentText = view === "front" ? frontText : backText;

  // Handle Dragging within printable zone
  const handleMouseDown = (item: "artwork" | "text", e: React.MouseEvent) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveDragItem(item);
    const orig = item === "artwork" ? { x: currentArtwork.x, y: currentArtwork.y } : { x: currentText.x, y: currentText.y };
    setDragStart({ x: e.clientX, y: e.clientY, origX: orig.x, origY: orig.y });
  };

  useEffect(() => {
    if (!activeDragItem || !dragStart || !interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = ((e.clientX - dragStart.x) / 300) * 100;
      const dy = ((e.clientY - dragStart.y) / 300) * 100;

      const newX = Math.max(-45, Math.min(45, dragStart.origX + dx));
      const newY = Math.max(-45, Math.min(45, dragStart.origY + dy));

      if (activeDragItem === "artwork" && onUpdateArtwork) {
        onUpdateArtwork(view, { x: Math.round(newX), y: Math.round(newY) });
      } else if (activeDragItem === "text" && onUpdateText) {
        onUpdateText(view, { x: Math.round(newX), y: Math.round(newY) });
      }
    };

    const handleMouseUp = () => {
      setActiveDragItem(null);
      setDragStart(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeDragItem, dragStart, view, onUpdateArtwork, onUpdateText, interactive]);

  // Finish filter styling
  const getFinishStyle = () => {
    if (finish === "puff") {
      return {
        filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.5)) contrast(110%)",
      };
    }
    if (finish === "metallic") {
      return {
        filter: "drop-shadow(0 1px 3px rgba(255,255,255,0.4)) brightness(115%) contrast(110%)",
      };
    }
    return {};
  };

  // Font family resolution
  const getFontFamily = (fontType: string) => {
    switch (fontType) {
      case "mono":
        return "'Courier New', Courier, monospace";
      case "serif":
        return "'Cinzel', Georgia, serif";
      case "display":
        return "'Impact', 'Arial Black', sans-serif";
      case "sans":
      default:
        return "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    }
  };

  // Printable Zone Dimensions and Positioning by Placement
  const getPlacementBoxStyle = () => {
    if (view === "front") {
      switch (placement) {
        case "front-left": // Left breast/pocket
          return {
            top: "28%",
            left: "58%",
            width: "22%",
            height: "22%",
          };
        case "front-full": // Full front
          return {
            top: "25%",
            left: "25%",
            width: "50%",
            height: "58%",
          };
        case "front-chest": // Standard chest center
        default:
          return {
            top: "27%",
            left: "30%",
            width: "40%",
            height: "42%",
          };
      }
    } else {
      switch (placement) {
        case "back-upper": // Upper neck hit
          return {
            top: "22%",
            left: "35%",
            width: "30%",
            height: "16%",
          };
        case "back-full": // Massive full back
          return {
            top: "24%",
            left: "22%",
            width: "56%",
            height: "60%",
          };
        case "back-center": // Standard back center
        default:
          return {
            top: "28%",
            left: "28%",
            width: "44%",
            height: "46%",
          };
      }
    }
  };

  const isLightColor =
    colorHex.toLowerCase() === "#ffffff" ||
    colorHex.toLowerCase() === "#fbfbfb" ||
    colorHex.toLowerCase() === "#d9c9b6" ||
    colorHex.toLowerCase() === "#e8e5de";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. REALISTIC VECTOR GARMENT SILHOUETTE                   */}
      {/* ======================================================== */}
      <svg
        viewBox="0 0 500 560"
        className="w-full h-full max-h-[520px] max-w-[500px] drop-shadow-2xl transition-colors duration-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Natural Fabric Texture & Shading Gradients */}
          <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
            <stop offset="15%" stopColor="#000" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#fff" stopOpacity={isLightColor ? "0.08" : "0.15"} />
            <stop offset="85%" stopColor="#000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
          </linearGradient>

          <linearGradient id="verticalDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>

          <radialGradient id="chestHighlight" cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#fff" stopOpacity={isLightColor ? "0.15" : "0.22"} />
            <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
          </radialGradient>

          {/* Crease Shadow Pattern */}
          <filter id="fabricNoise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" in="gl" operator="in" />
          </filter>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* GARMENT TYPE: HOODIE                                 */}
        {/* ---------------------------------------------------- */}
        {garmentId === "hoodie" ? (
          view === "front" ? (
            <g id="hoodie-front">
              {/* Outer Silhouette */}
              <path
                d="M 175 60 C 210 75 290 75 325 60 L 450 170 L 420 230 L 370 190 L 365 480 L 135 480 L 130 190 L 80 230 L 50 170 Z"
                fill={colorHex}
              />
              {/* Shading Overlays */}
              <path
                d="M 175 60 C 210 75 290 75 325 60 L 450 170 L 420 230 L 370 190 L 365 480 L 135 480 L 130 190 L 80 230 L 50 170 Z"
                fill="url(#bodyShade)"
              />
              <path
                d="M 135 150 L 365 150 L 365 480 L 135 480 Z"
                fill="url(#verticalDepth)"
              />

              {/* Hood Structure */}
              <path
                d="M 180 55 C 160 20 220 15 250 15 C 280 15 340 20 320 55 C 300 85 200 85 180 55 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />
              <path
                d="M 215 55 C 235 68 265 68 285 55 C 275 80 225 80 215 55 Z"
                fill="#000"
                fillOpacity="0.3"
              />

              {/* Kangaroo Pouch */}
              <path
                d="M 180 340 L 320 340 L 345 430 L 155 430 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
              <path
                d="M 180 340 L 320 340 L 345 430 L 155 430 Z"
                fill="url(#chestHighlight)"
              />
              {/* Kangaroo Pocket Openings */}
              <path d="M 180 340 C 170 370 160 400 155 430" stroke="#000" strokeWidth="2" strokeOpacity="0.3" fill="none" />
              <path d="M 320 340 C 330 370 340 400 345 430" stroke="#000" strokeWidth="2" strokeOpacity="0.3" fill="none" />

              {/* Drawstrings */}
              <path d="M 225 70 Q 220 120 215 170" stroke={isLightColor ? "#333" : "#FBF9F4"} strokeWidth="3" strokeLinecap="round" fill="none" />
              <rect x="213" y="170" width="4" height="12" rx="1" fill="#C5A059" />
              <path d="M 275 70 Q 280 120 285 170" stroke={isLightColor ? "#333" : "#FBF9F4"} strokeWidth="3" strokeLinecap="round" fill="none" />
              <rect x="283" y="170" width="4" height="12" rx="1" fill="#C5A059" />

              {/* Ribbed Hem & Cuffs */}
              <rect x="135" y="460" width="230" height="20" fill="#000" fillOpacity="0.12" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
              <path d="M 50 170 L 80 230 L 92 215 L 65 155 Z" fill="#000" fillOpacity="0.08" />
              <path d="M 450 170 L 420 230 L 408 215 L 435 155 Z" fill="#000" fillOpacity="0.08" />
            </g>
          ) : (
            <g id="hoodie-back">
              {/* Outer Silhouette */}
              <path
                d="M 175 60 C 210 50 290 50 325 60 L 450 170 L 420 230 L 370 190 L 365 480 L 135 480 L 130 190 L 80 230 L 50 170 Z"
                fill={colorHex}
              />
              <path
                d="M 175 60 C 210 50 290 50 325 60 L 450 170 L 420 230 L 370 190 L 365 480 L 135 480 L 130 190 L 80 230 L 50 170 Z"
                fill="url(#bodyShade)"
              />
              <path
                d="M 135 150 L 365 150 L 365 480 L 135 480 Z"
                fill="url(#verticalDepth)"
              />
              {/* Back Hood Fold Resting Down */}
              <path
                d="M 180 50 C 190 20 310 20 320 50 C 330 90 310 130 250 135 C 190 130 170 90 180 50 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
              <path
                d="M 195 65 C 220 85 280 85 305 65 C 295 115 205 115 195 65 Z"
                fill="#000"
                fillOpacity="0.25"
              />
              {/* Ribbed Hem */}
              <rect x="135" y="460" width="230" height="20" fill="#000" fillOpacity="0.12" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
            </g>
          )
        ) : garmentId === "full-sleeve" || garmentId === "sweatshirt" ? (
          /* ---------------------------------------------------- */
          /* GARMENT TYPE: FULL SLEEVE TEE / SWEATSHIRT           */
          /* ---------------------------------------------------- */
          view === "front" ? (
            <g id="longsleeve-front">
              {/* Outer Body with Long Sleeves */}
              <path
                d="M 190 65 C 220 80 280 80 310 65 L 455 240 L 430 270 L 365 180 L 365 480 L 135 480 L 135 180 L 70 270 L 45 240 Z"
                fill={colorHex}
              />
              <path
                d="M 190 65 C 220 80 280 80 310 65 L 455 240 L 430 270 L 365 180 L 365 480 L 135 480 L 135 180 L 70 270 L 45 240 Z"
                fill="url(#bodyShade)"
              />
              <path
                d="M 135 120 L 365 120 L 365 480 L 135 480 Z"
                fill="url(#verticalDepth)"
              />
              <circle cx="250" cy="220" r="160" fill="url(#chestHighlight)" opacity="0.4" />

              {/* Crewneck Collar */}
              <path
                d="M 190 65 C 215 95 285 95 310 65 C 295 105 205 105 190 65 Z"
                fill="#000"
                fillOpacity="0.18"
              />
              <path
                d="M 190 65 C 220 82 280 82 310 65"
                stroke="#000"
                strokeWidth="2"
                strokeOpacity="0.3"
                fill="none"
              />

              {/* Sweatshirt Triangular V-Stitch inset */}
              {garmentId === "sweatshirt" && (
                <path
                  d="M 235 90 L 250 115 L 265 90"
                  stroke="#000"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  fill="none"
                />
              )}

              {/* Sleeve Cuffs & Hem */}
              <rect x="135" y="465" width="230" height="15" fill="#000" fillOpacity="0.12" />
              <path d="M 45 240 L 70 270 L 62 278 L 37 248 Z" fill="#000" fillOpacity="0.15" />
              <path d="M 455 240 L 430 270 L 438 278 L 463 248 Z" fill="#000" fillOpacity="0.15" />
            </g>
          ) : (
            <g id="longsleeve-back">
              {/* Back View */}
              <path
                d="M 190 65 C 220 55 280 55 310 65 L 455 240 L 430 270 L 365 180 L 365 480 L 135 480 L 135 180 L 70 270 L 45 240 Z"
                fill={colorHex}
              />
              <path
                d="M 190 65 C 220 55 280 55 310 65 L 455 240 L 430 270 L 365 180 L 365 480 L 135 480 L 135 180 L 70 270 L 45 240 Z"
                fill="url(#bodyShade)"
              />
              <path
                d="M 135 120 L 365 120 L 365 480 L 135 480 Z"
                fill="url(#verticalDepth)"
              />
              {/* Back Collar Crescent */}
              <path
                d="M 190 65 C 225 58 275 58 310 65 C 285 75 215 75 190 65 Z"
                fill="#000"
                fillOpacity="0.25"
              />
              <rect x="135" y="465" width="230" height="15" fill="#000" fillOpacity="0.12" />
            </g>
          )
        ) : garmentId === "polo" ? (
          /* ---------------------------------------------------- */
          /* GARMENT TYPE: POLO T-SHIRT                           */
          /* ---------------------------------------------------- */
          view === "front" ? (
            <g id="polo-front">
              <path
                d="M 180 70 L 320 70 L 430 150 L 390 195 L 355 170 L 355 480 L 145 480 L 145 170 L 110 195 L 70 150 Z"
                fill={colorHex}
              />
              <path
                d="M 180 70 L 320 70 L 430 150 L 390 195 L 355 170 L 355 480 L 145 480 L 145 170 L 110 195 L 70 150 Z"
                fill="url(#bodyShade)"
              />
              {/* Polo Collar Wings */}
              <path
                d="M 180 70 L 220 115 L 250 85 L 210 60 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
              <path
                d="M 320 70 L 280 115 L 250 85 L 290 60 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
              {/* Placket */}
              <rect
                x="242"
                y="85"
                width="16"
                height="65"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <circle cx="250" cy="100" r="3" fill="#FFF" stroke="#666" strokeWidth="0.8" />
              <circle cx="250" cy="125" r="3" fill="#FFF" stroke="#666" strokeWidth="0.8" />
            </g>
          ) : (
            <g id="polo-back">
              <path
                d="M 180 65 C 220 55 280 55 320 65 L 430 150 L 390 195 L 355 170 L 355 480 L 145 480 L 145 170 L 110 195 L 70 150 Z"
                fill={colorHex}
              />
              <path
                d="M 180 65 C 220 55 280 55 320 65 L 430 150 L 390 195 L 355 170 L 355 480 L 145 480 L 145 170 L 110 195 L 70 150 Z"
                fill="url(#bodyShade)"
              />
              {/* Back Turned-down Collar Rib */}
              <path
                d="M 180 65 C 220 75 280 75 320 65 C 310 50 190 50 180 65 Z"
                fill={colorHex}
                stroke="#000"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
            </g>
          )
        ) : (
          /* ---------------------------------------------------- */
          /* GARMENT TYPE: T-SHIRT (OVERSIZED, HALF SLEEVE, REGULAR) */
          /* ---------------------------------------------------- */
          view === "front" ? (
            <g id="tee-front">
              {/* Oversized boxy silhouette vs Regular */}
              <path
                d={
                  garmentId === "oversized"
                    ? "M 185 70 C 220 90 280 90 315 70 L 450 165 L 405 225 L 370 185 L 370 485 L 130 485 L 130 185 L 95 225 L 50 165 Z"
                    : "M 185 70 C 220 85 280 85 315 70 L 435 155 L 395 205 L 360 175 L 360 480 L 140 480 L 140 175 L 105 205 L 65 155 Z"
                }
                fill={colorHex}
              />
              <path
                d={
                  garmentId === "oversized"
                    ? "M 185 70 C 220 90 280 90 315 70 L 450 165 L 405 225 L 370 185 L 370 485 L 130 485 L 130 185 L 95 225 L 50 165 Z"
                    : "M 185 70 C 220 85 280 85 315 70 L 435 155 L 395 205 L 360 175 L 360 480 L 140 480 L 140 175 L 105 205 L 65 155 Z"
                }
                fill="url(#bodyShade)"
              />
              <path
                d="M 130 120 L 370 120 L 370 485 L 130 485 Z"
                fill="url(#verticalDepth)"
              />
              <circle cx="250" cy="220" r="170" fill="url(#chestHighlight)" opacity="0.35" />

              {/* Ribbed Collar Band */}
              <path
                d="M 185 70 C 215 95 285 95 315 70 C 295 108 205 108 185 70 Z"
                fill="#000"
                fillOpacity="0.18"
              />
              <path
                d="M 185 70 C 220 85 280 85 315 70"
                stroke="#000"
                strokeWidth="2"
                strokeOpacity="0.3"
                fill="none"
              />

              {/* Streetwear Drop Shoulder Seams */}
              <line x1="185" y1="70" x2="135" y2="180" stroke="#000" strokeWidth="1" strokeOpacity="0.15" />
              <line x1="315" y1="70" x2="365" y2="180" stroke="#000" strokeWidth="1" strokeOpacity="0.15" />

              {/* Subtle Fold Lines */}
              <path d="M 140 220 Q 155 240 145 280" stroke="#000" strokeWidth="1" strokeOpacity="0.12" fill="none" />
              <path d="M 360 220 Q 345 240 355 280" stroke="#000" strokeWidth="1" strokeOpacity="0.12" fill="none" />
            </g>
          ) : (
            <g id="tee-back">
              <path
                d={
                  garmentId === "oversized"
                    ? "M 185 68 C 220 55 280 55 315 68 L 450 165 L 405 225 L 370 185 L 370 485 L 130 485 L 130 185 L 95 225 L 50 165 Z"
                    : "M 185 68 C 220 55 280 55 315 68 L 435 155 L 395 205 L 360 175 L 360 480 L 140 480 L 140 175 L 105 205 L 65 155 Z"
                }
                fill={colorHex}
              />
              <path
                d={
                  garmentId === "oversized"
                    ? "M 185 68 C 220 55 280 55 315 68 L 450 165 L 405 225 L 370 185 L 370 485 L 130 485 L 130 185 L 95 225 L 50 165 Z"
                    : "M 185 68 C 220 55 280 55 315 68 L 435 155 L 395 205 L 360 175 L 360 480 L 140 480 L 140 175 L 105 205 L 65 155 Z"
                }
                fill="url(#bodyShade)"
              />
              <path
                d="M 130 120 L 370 120 L 370 485 L 130 485 Z"
                fill="url(#verticalDepth)"
              />
              {/* Back Collar Band */}
              <path
                d="M 185 68 C 220 60 280 60 315 68 C 290 76 210 76 185 68 Z"
                fill="#000"
                fillOpacity="0.25"
              />
            </g>
          )
        )}
      </svg>

      {/* ======================================================== */}
      {/* 2. PRINTABLE ZONE OVERLAY & INTERACTIVE ARTWORK STAGE    */}
      {/* ======================================================== */}
      <div
        className={`absolute pointer-events-auto transition-all duration-200 ${
          showGuidelines
            ? "border-2 border-dashed border-[#D8FF36]/70 bg-[#D8FF36]/5"
            : "border border-transparent"
        }`}
        style={getPlacementBoxStyle()}
      >
        {/* Printable Area Zone Label (Only visible when guidelines active) */}
        {showGuidelines && (
          <div className="absolute -top-5 left-0 right-0 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#D8FF36] px-1 pointer-events-none">
            <span>{view.toUpperCase()} PRINT ZONE</span>
            <span>300 DPI // CMYK</span>
          </div>
        )}

        {/* Alignment Crosshairs (Only visible when guidelines active) */}
        {showGuidelines && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ARTWORK LAYER                                        */}
        {/* ---------------------------------------------------- */}
        {currentArtwork.url && (
          <div
            onMouseDown={(e) => handleMouseDown("artwork", e)}
            className="absolute cursor-move select-none transition-shadow"
            style={{
              top: `calc(50% + ${currentArtwork.y}%)`,
              left: `calc(50% + ${currentArtwork.x}%)`,
              transform: `translate(-50%, -50%) rotate(${currentArtwork.rotation}deg) scale(${currentArtwork.scale})`,
              maxWidth: "90%",
              maxHeight: "90%",
              ...getFinishStyle(),
            }}
          >
            <img
              src={currentArtwork.url}
              alt="Custom Artwork"
              className="max-w-[200px] max-h-[220px] object-contain pointer-events-none filter drop-shadow-md"
              draggable={false}
            />
            {interactive && activeDragItem === "artwork" && (
              <div className="absolute -inset-2 border-2 border-[#D8FF36] pointer-events-none animate-pulse" />
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* CUSTOM TEXT LAYER                                    */}
        {/* ---------------------------------------------------- */}
        {currentText.text.trim() && (
          <div
            onMouseDown={(e) => handleMouseDown("text", e)}
            className="absolute cursor-move select-none whitespace-pre text-center"
            style={{
              top: `calc(50% + ${currentText.y}%)`,
              left: `calc(50% + ${currentText.x}%)`,
              transform: `translate(-50%, -50%) rotate(${currentText.rotation}deg)`,
              fontFamily: getFontFamily(currentText.font),
              color: currentText.color,
              fontSize: `${currentText.fontSize}px`,
              fontWeight: currentText.font === "display" ? 900 : 700,
              letterSpacing: currentText.font === "mono" ? "0.15em" : "0.05em",
              lineHeight: 1.1,
              ...getFinishStyle(),
            }}
          >
            {currentText.text}
            {interactive && activeDragItem === "text" && (
              <div className="absolute -inset-1 border-2 border-[#D8FF36] pointer-events-none animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
