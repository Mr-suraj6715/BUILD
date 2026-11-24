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
    const isHoodie = garmentId === "hoodie";
    const isPolo = garmentId === "polo";

    if (view === "front") {
      switch (placement) {
        case "front-left": // Left breast/pocket
          return {
            top: isHoodie ? "26%" : isPolo ? "30%" : "25%",
            left: "56%",
            width: "20%",
            height: "18%",
          };
        case "front-full": // Full front
          return {
            top: isHoodie ? "24%" : isPolo ? "28%" : "22%",
            left: "26%",
            width: "48%",
            height: isHoodie ? "26%" : isPolo ? "48%" : "54%",
          };
        case "front-chest": // Standard chest center
        default:
          return {
            top: isHoodie ? "24%" : isPolo ? "29%" : "24%",
            left: "28%",
            width: "44%",
            height: isHoodie ? "26%" : "44%",
          };
      }
    } else {
      switch (placement) {
        case "back-upper": // Upper neck hit
          return {
            top: isHoodie ? "32%" : "18%",
            left: "35%",
            width: "30%",
            height: "14%",
          };
        case "back-full": // Massive full back
          return {
            top: isHoodie ? "32%" : "22%",
            left: "23%",
            width: "54%",
            height: isHoodie ? "48%" : "56%",
          };
        case "back-center": // Standard back center
        default:
          return {
            top: isHoodie ? "32%" : "22%",
            left: "26%",
            width: "48%",
            height: isHoodie ? "48%" : "50%",
          };
      }
    }
  };

  const isPureWhite =
    colorHex.toLowerCase() === "#ffffff" ||
    colorHex.toLowerCase() === "#fbfbfb" ||
    colorHex.toLowerCase() === "#faf9f6";

  const isLightColor =
    isPureWhite ||
    colorHex.toLowerCase() === "#fffff0" ||
    colorHex.toLowerCase() === "#fffdd0" ||
    colorHex.toLowerCase() === "#d9c9b6" ||
    colorHex.toLowerCase() === "#c2b280" ||
    colorHex.toLowerCase() === "#e8e5de" ||
    colorHex.toLowerCase() === "#d3d3d3" ||
    colorHex.toLowerCase() === "#e6e6fa" ||
    colorHex.toLowerCase() === "#f4c2c2" ||
    colorHex.toLowerCase() === "#fff44f";

  // Dedicated clean photographic studio mockups for every single garment type & view
  const garmentImgSrc = `/images/mockups/mockup-${garmentId}-${view}.png`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
    >
      {/* 
        Unified 1:1 square canvas shared by both the garment photo and the print zone.
        This guarantees 100% identical placement and scaling in the editor, modal, and mobile!
      */}
      <div className="relative aspect-square w-full h-full max-h-[540px] max-w-[540px] flex items-center justify-center">
        {/* Real Apparel Base Photo (Photographed in professional fashion studio) */}
        <img
          src={garmentImgSrc}
          alt={`${garmentId} ${view}`}
          className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl transition-all duration-300 pointer-events-none select-none"
        />

        {/* Dynamic Color Multiply Tint Overlay (Masked exactly to the real garment silhouette) */}
        {!isPureWhite && (
          <div
            className="absolute inset-0 mix-blend-multiply transition-colors duration-300 pointer-events-none"
            style={{
              backgroundColor: colorHex,
              maskImage: `url(${garmentImgSrc})`,
              WebkitMaskImage: `url(${garmentImgSrc})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              opacity: isLightColor ? 0.82 : 0.94,
            }}
          />
        )}

        {/* ======================================================== */}
        {/* PRINTABLE ZONE OVERLAY & INTERACTIVE ARTWORK STAGE       */}
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
          {/* ARTWORK LAYER (Sized proportionally to the zone)     */}
          {/* ---------------------------------------------------- */}
          {currentArtwork.url && (
            <div
              onMouseDown={(e) => handleMouseDown("artwork", e)}
              className="absolute cursor-move select-none transition-shadow z-20 flex items-center justify-center"
              style={{
                top: `calc(50% + ${currentArtwork.y}%)`,
                left: `calc(50% + ${currentArtwork.x}%)`,
                width: "84%",
                height: "84%",
                transform: `translate(-50%, -50%) rotate(${currentArtwork.rotation}deg) scale(${currentArtwork.scale})`,
                ...getFinishStyle(),
              }}
            >
              <img
                src={
                  isLightColor && currentArtwork.url.includes("demo-front-logo.png")
                    ? "/images/studio/demo-front-logo-dark.png"
                    : isLightColor && currentArtwork.url.includes("demo-back-graphic.png")
                    ? "/images/studio/demo-back-graphic-dark.png"
                    : currentArtwork.url
                }
                alt="Custom Artwork"
                className="w-full h-full object-contain pointer-events-none filter drop-shadow-md"
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
    </div>
  );
}
