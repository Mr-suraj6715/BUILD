"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Check,
  ShoppingBag,
  Sparkles,
  Layers,
  Sliders,
  ArrowLeft,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Type,
  Eye,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import GarmentModel, { CustomArtworkState, CustomTextState } from "@/components/studio/GarmentModel";
import { formatPrice } from "@/lib/utils";

// =========================================================================
// 1. GARMENT SILHOUETTES CATALOG
// =========================================================================
interface GarmentOption {
  id: string;
  name: string;
  fit: string;
  gsm: number;
  fabric: string;
  basePrice: number;
  description: string;
}

const GARMENTS: GarmentOption[] = [
  {
    id: "half-sleeve",
    name: "Half Sleeve T-Shirt",
    fit: "Relaxed Everyday",
    gsm: 220,
    fabric: "100% Combed Compact Cotton",
    basePrice: 1199,
    description: "Breathable daily luxury blank with reinforced rib collar.",
  },
  {
    id: "full-sleeve",
    name: "Full Sleeve T-Shirt",
    fit: "Tailored Street Fit",
    gsm: 240,
    fabric: "Heavyweight Single Jersey Cotton",
    basePrice: 1399,
    description: "Extended sleeves with dense ribbed cuffs for crisp layering.",
  },
  {
    id: "oversized",
    name: "Oversized T-Shirt",
    fit: "Tokyo Boxy Fit",
    gsm: 280,
    fabric: "High-Density Dense Weave Cotton",
    basePrice: 1699,
    description: "Signature drop-shoulder drape with a heavy structured silhouette.",
  },
  {
    id: "regular-fit",
    name: "Regular Fit T-Shirt",
    fit: "Classic Straight Cut",
    gsm: 190,
    fabric: "Pre-Shrunk Bio-Washed Cotton",
    basePrice: 999,
    description: "Clean essential cut for everyday comfort and sharp prints.",
  },
  {
    id: "polo",
    name: "Polo T-Shirt",
    fit: "Structured Athletic",
    gsm: 260,
    fabric: "Honeycomb Pique Cotton",
    basePrice: 1499,
    description: "Classic collar with 2-button placket and reinforced side vents.",
  },
  {
    id: "hoodie",
    name: "Heavyweight Hoodie",
    fit: "Oversized Streetwear",
    gsm: 380,
    fabric: "French Terry Fleeceback Cotton",
    basePrice: 2499,
    description: "Double-layered thermal hood, kangaroo pouch & metal aglet cords.",
  },
  {
    id: "sweatshirt",
    name: "Crewneck Sweatshirt",
    fit: "Relaxed Raglan",
    gsm: 350,
    fabric: "Brushed Fleece Heavy Cotton",
    basePrice: 2199,
    description: "Athletic triangular V-stitch inset with heavy ribbed waistband.",
  },
];

// =========================================================================
// 2. GARMENT COLORWAYS (CATEGORIZED LIBRARY)
// =========================================================================
interface ColorOption {
  name: string;
  hex: string;
  category: "Classic" | "Streetwear" | "Earthy" | "Bold";
  badge?: string;
}

const COLORWAYS: ColorOption[] = [
  // Classic Colours
  { name: "Pure White", hex: "#FFFFFF", category: "Classic", badge: "CORE" },
  { name: "Jet Black", hex: "#111111", category: "Classic", badge: "CORE" },
  { name: "Charcoal", hex: "#363636", category: "Classic" },
  { name: "Heather Grey", hex: "#9E9E9E", category: "Classic" },
  { name: "Light Grey", hex: "#D3D3D3", category: "Classic" },
  { name: "Off White", hex: "#FAF9F6", category: "Classic" },
  { name: "Ivory", hex: "#FFFFF0", category: "Classic" },
  { name: "Cream", hex: "#FFFDD0", category: "Classic" },

  // Premium Streetwear Colours
  { name: "Midnight Navy", hex: "#152238", category: "Streetwear", badge: "POPULAR" },
  { name: "Deep Navy", hex: "#0A192F", category: "Streetwear" },
  { name: "Royal Blue", hex: "#4169E1", category: "Streetwear" },
  { name: "Sky Blue", hex: "#87CEEB", category: "Streetwear" },
  { name: "Burgundy", hex: "#800020", category: "Streetwear" },
  { name: "Deep Maroon", hex: "#4A0E17", category: "Streetwear", badge: "SIGNATURE" },
  { name: "Wine", hex: "#722F37", category: "Streetwear" },
  { name: "Chocolate Brown", hex: "#3D1C02", category: "Streetwear" },
  { name: "Mocha", hex: "#493628", category: "Streetwear" },
  { name: "Coffee Brown", hex: "#362B28", category: "Streetwear" },
  { name: "Premium Beige", hex: "#D9C9B6", category: "Streetwear", badge: "NEW" },
  { name: "Sand", hex: "#C2B280", category: "Streetwear" },
  { name: "Taupe", hex: "#483C32", category: "Streetwear" },

  // Earthy Colours
  { name: "Olive Green", hex: "#4B5320", category: "Earthy", badge: "TRENDING" },
  { name: "Forest Green", hex: "#228B22", category: "Earthy" },
  { name: "Sage Green", hex: "#9DC183", category: "Earthy" },
  { name: "Moss Green", hex: "#8A9A5B", category: "Earthy" },
  { name: "Khaki", hex: "#C3B091", category: "Earthy" },
  { name: "Stone", hex: "#928E85", category: "Earthy" },
  { name: "Rust", hex: "#B7410E", category: "Earthy" },
  { name: "Terracotta", hex: "#E2725B", category: "Earthy" },

  // Bold Colours
  { name: "Crimson Red", hex: "#990000", category: "Bold" },
  { name: "Cherry Red", hex: "#D2042D", category: "Bold" },
  { name: "Mustard Yellow", hex: "#FFDB58", category: "Bold" },
  { name: "Lemon Yellow", hex: "#FFF44F", category: "Bold" },
  { name: "Orange", hex: "#FFA500", category: "Bold" },
  { name: "Lavender", hex: "#E6E6FA", category: "Bold" },
  { name: "Purple", hex: "#800080", category: "Bold" },
  { name: "Teal", hex: "#008080", category: "Bold" },
  { name: "Emerald Green", hex: "#50C878", category: "Bold" },
  { name: "Baby Pink", hex: "#F4C2C2", category: "Bold" },
  { name: "Dusty Pink", hex: "#DCAE96", category: "Bold" },
];

// =========================================================================
// 3. PRINT PLACEMENT ZONES
// =========================================================================
const FRONT_PLACEMENTS = [
  { id: "front-chest", name: "Center Chest (300×350mm)" },
  { id: "front-left", name: "Left Breast Pocket Hit (100×100mm)" },
  { id: "front-full", name: "Full Front Heavy Hit (360×450mm)" },
];

const BACK_PLACEMENTS = [
  { id: "back-center", name: "Center Back (320×400mm)" },
  { id: "back-upper", name: "Upper Back Neck Hit (250×80mm)" },
  { id: "back-full", name: "Massive Full Back (400×520mm)" },
];

// =========================================================================
// 4. PRINT SIDE OPTIONS & FINISHES
// =========================================================================
const PRINT_SIDES = [
  { id: "front-only", name: "Front Only", extra: 0, desc: "Single side print" },
  { id: "back-only", name: "Back Only", extra: 100, desc: "Single side back print" },
  { id: "both", name: "Front + Back", extra: 250, desc: "Dual print capsule" },
];

const FINISHES = [
  {
    id: "dtg",
    name: "Kornit Ultra-HD DTG",
    extra: 0,
    desc: "1200 DPI soft-hand breathable digital print",
  },
  {
    id: "puff",
    name: "3D Tactile Puff Print",
    extra: 200,
    desc: "Raised tactile screenprint with deep 3D texture",
  },
  {
    id: "metallic",
    name: "Cyber Metallic Foil",
    extra: 350,
    desc: "Reflective metallic specular ink finish",
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];

const TEXT_FONTS = [
  { id: "mono", name: "Mono Cyber", label: "Courier" },
  { id: "sans", name: "Helvetica Street", label: "Inter" },
  { id: "serif", name: "Gothic Display", label: "Cinzel" },
  { id: "display", name: "Brutalist Heavy", label: "Impact" },
];

const TEXT_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#111111" },
  { name: "BUILD Neon", hex: "#D8FF36" },
  { name: "Crimson Red", hex: "#EF4444" },
  { name: "Cyber Gold", hex: "#F59E0B" },
  { name: "Stealth Grey", hex: "#9CA3AF" },
];

export default function CustomPrintStudioPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  // Garment & Configuration State
  const [selectedGarment, setSelectedGarment] = useState<GarmentOption>(GARMENTS[2]); // Default Oversized
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORWAYS[0]); // Midnight Navy
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [printSide, setPrintSide] = useState<string>("both");
  const [frontPlacement, setFrontPlacement] = useState<string>("front-chest");
  const [backPlacement, setBackPlacement] = useState<string>("back-center");
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [quantity, setQuantity] = useState<number>(1);

  // Artwork Upload State (Preloaded with official BUILD Demo Design)
  const [frontArtwork, setFrontArtwork] = useState<CustomArtworkState>({
    url: "/images/studio/demo-front-logo.png",
    fileName: "build_summit_front.png",
    x: 0,
    y: 0,
    scale: 0.85,
    rotation: 0,
  });

  const [backArtwork, setBackArtwork] = useState<CustomArtworkState>({
    url: "/images/studio/demo-back-graphic.png",
    fileName: "build_tomorrow_back.png",
    x: 0,
    y: 0,
    scale: 0.95,
    rotation: 0,
  });

  // Typography State
  const [frontText, setFrontText] = useState<CustomTextState>({
    text: "",
    font: "mono",
    color: "#FFFFFF",
    fontSize: 22,
    x: 0,
    y: 20,
    rotation: 0,
  });

  const [backText, setBackText] = useState<CustomTextState>({
    text: "",
    font: "mono",
    color: "#FFFFFF",
    fontSize: 22,
    x: 0,
    y: 20,
    rotation: 0,
  });

  // UI Control States
  const [activeRightTab, setActiveRightTab] = useState<"artwork" | "text" | "specs">("artwork");
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resWarning, setResWarning] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // File Input References
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Price Calculations
  const selectedPrintSideObj = PRINT_SIDES.find((p) => p.id === printSide) || PRINT_SIDES[0];
  const unitPrice = selectedGarment.basePrice + selectedPrintSideObj.extra + selectedFinish.extra;

  // Color Category State
  const [colorCategory, setColorCategory] = useState<string>("All");

  const filteredColors = COLORWAYS.filter((c) => {
    if (colorCategory === "All") return true;
    return c.category === colorCategory;
  });

  // Template Quick Actions
  const handleStartWithBuildDesign = () => {
    setFrontArtwork({
      url: "/images/studio/demo-front-logo.png",
      fileName: "build_summit_front.png",
      x: 0,
      y: 0,
      scale: 0.85,
      rotation: 0,
    });
    setBackArtwork({
      url: "/images/studio/demo-back-graphic.png",
      fileName: "build_tomorrow_back.png",
      x: 0,
      y: 0,
      scale: 0.95,
      rotation: 0,
    });
    setFrontText({
      text: "",
      font: "mono",
      color: "#FFFFFF",
      fontSize: 22,
      x: 0,
      y: 20,
      rotation: 0,
    });
    setBackText({
      text: "",
      font: "mono",
      color: "#FFFFFF",
      fontSize: 22,
      x: 0,
      y: 20,
      rotation: 0,
    });
  };

  const handleStartFromBlank = () => {
    setFrontArtwork({
      url: null,
      fileName: undefined,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    });
    setBackArtwork({
      url: null,
      fileName: undefined,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    });
    setFrontText({
      text: "",
      font: "mono",
      color: "#FFFFFF",
      fontSize: 22,
      x: 0,
      y: 20,
      rotation: 0,
    });
    setBackText({
      text: "",
      font: "mono",
      color: "#FFFFFF",
      fontSize: 22,
      x: 0,
      y: 20,
      rotation: 0,
    });
  };

  // Volume discounts: 5+ pcs = 10% off, 10+ pcs = 15% off
  const discountRate = quantity >= 10 ? 0.15 : quantity >= 5 ? 0.1 : 0;
  const rawSubtotal = unitPrice * quantity;
  const volumeDiscount = Math.round(rawSubtotal * discountRate);
  const finalTotal = rawSubtotal - volumeDiscount;

  // Artwork Update Handler
  const handleUpdateArtwork = (side: "front" | "back", updates: Partial<CustomArtworkState>) => {
    if (side === "front") {
      setFrontArtwork((prev) => ({ ...prev, ...updates }));
    } else {
      setBackArtwork((prev) => ({ ...prev, ...updates }));
    }
  };

  // Text Update Handler
  const handleUpdateText = (side: "front" | "back", updates: Partial<CustomTextState>) => {
    if (side === "front") {
      setFrontText((prev) => ({ ...prev, ...updates }));
    } else {
      setBackText((prev) => ({ ...prev, ...updates }));
    }
  };

  // Real Persistent File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);
    setResWarning(null);

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("Artwork file exceeds 25MB limit. Please compress or optimize.");
      setUploadLoading(false);
      return;
    }

    // Check resolution for raster images
    if (file.type.startsWith("image/") && !file.type.includes("svg")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.naturalWidth < 800 || img.naturalHeight < 800) {
          setResWarning("Resolution is under 800px. Print quality may be lower. 300+ DPI recommended.");
        }
      };
    }

    // 1. Instantly create an in-memory Object URL for zero-latency preview
    const localPreviewUrl = URL.createObjectURL(file);

    if (side === "front") {
      setFrontArtwork((prev) => ({
        ...prev,
        url: localPreviewUrl,
        fileName: file.name,
      }));
      setActiveView("front"); // Automatically switch view so user sees their design
      if (printSide === "back-only") {
        setPrintSide("both");
      }
    } else {
      setBackArtwork((prev) => ({
        ...prev,
        url: localPreviewUrl,
        fileName: file.name,
      }));
      setActiveView("back"); // Automatically switch view so user sees their design
      if (printSide === "front-only") {
        setPrintSide("both");
      }
    }

    // 2. Upload to server in background for persistent storage
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("side", side);

      const res = await fetch("/api/custom-studio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload artwork");
      }

      // Update state with permanent server URL
      if (side === "front") {
        setFrontArtwork((prev) => ({
          ...prev,
          url: data.url,
          fileName: file.name,
        }));
      } else {
        setBackArtwork((prev) => ({
          ...prev,
          url: data.url,
          fileName: file.name,
        }));
      }
    } catch (err: any) {
      console.warn("Server upload warning (local preview remains active):", err);
      // Even if server upload has latency, localPreviewUrl remains active!
    } finally {
      setUploadLoading(false);
    }
  };

  // Build Cart Payload
  const getCustomCartItem = () => {
    const customSummary = `${selectedGarment.name} (${selectedColor.name} / ${selectedSize})`;
    return {
      variantId: `custom-${Date.now()}`,
      productId: `custom-${selectedGarment.id}`,
      title: `CUSTOM // ${selectedGarment.name}`,
      slug: "custom-print",
      image: frontArtwork.url || backArtwork.url || "/images/stitch/brand-studio.jpg",
      price: unitPrice,
      originalPrice: unitPrice + 500,
      size: selectedSize,
      color: selectedColor.name,
      quantity,
      maxStock: 99,
      isCustom: true,
      customDesign: {
        garmentId: selectedGarment.id,
        garmentName: selectedGarment.name,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        size: selectedSize,
        printSide,
        frontPlacement,
        backPlacement,
        finish: selectedFinish.name,
        frontArtwork: frontArtwork.url,
        backArtwork: backArtwork.url,
        frontText: frontText.text,
        backText: backText.text,
      },
    };
  };

  // Add to Cart
  const handleAddToCart = () => {
    const item = getCustomCartItem();
    addToCart(item);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  // Buy Now
  const handleBuyNow = () => {
    const item = getCustomCartItem();
    addToCart(item);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#151515] flex flex-col selection:bg-[#D8FF36] selection:text-black">
      {/* ======================================================== */}
      {/* STUDIO TOP HEADER & SYSTEM STATUS                        */}
      {/* ======================================================== */}
      <div className="bg-[#101010] text-white border-b border-[#252525] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#999999] hover:text-[#D8FF36] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EXIT STUDIO</span>
            </Link>
            <span className="text-[#333333]">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D8FF36] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D8FF36]">
                BUILD LAB v5.0 // BESPOKE ENGINE
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#888888]">
            {/* Quick Template Presets */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleStartWithBuildDesign}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#D8FF36] hover:bg-[#cbf720] text-black font-mono text-[11px] font-bold uppercase transition-all shadow-sm rounded-none"
                title="Load approved BUILD summit front logo & architectural globe back graphic"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start With BUILD Design</span>
              </button>
              <button
                onClick={handleStartFromBlank}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#202020] hover:bg-[#2A2A2A] text-white font-mono text-[11px] font-bold uppercase border border-[#444] transition-all rounded-none"
                title="Clear all artwork and text to reveal a completely plain unbranded garment"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#888]" />
                <span>Start From Blank</span>
              </button>
            </div>

            <span className="hidden sm:inline text-[#333]">|</span>
            <span className="hidden sm:inline">GARMENT: <strong className="text-white">{selectedGarment.name.toUpperCase()}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">COLOR: <strong className="text-white">{selectedColor.name.toUpperCase()}</strong></span>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202020] hover:bg-[#2A2A2A] text-white font-mono text-xs border border-[#333] transition-colors uppercase font-bold"
            >
              <Eye className="w-3.5 h-3.5 text-[#D8FF36]" />
              Preview Mockup
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN 3-PANEL STUDIO WORKSPACE                            */}
      {/* ======================================================== */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==================================================== */}
          {/* LEFT PANEL: GARMENT, COLOR & SIZING (Cols: 3)       */}
          {/* ==================================================== */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Select Garment */}
            <div className="bg-white border border-[#E0DCD3] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#151515] flex items-center gap-2">
                  <span className="w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Select Garment
                </h3>
                <span className="font-mono text-[11px] text-[#777]">{GARMENTS.length} Models</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {GARMENTS.map((g) => {
                  const isSelected = selectedGarment.id === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGarment(g)}
                      className={`w-full text-left p-3 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#101010] text-white border-black shadow-md ring-1 ring-[#D8FF36]"
                          : "bg-[#FBF9F4] text-[#151515] border-[#E5E0D6] hover:border-black"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono font-bold text-xs uppercase tracking-tight">{g.name}</span>
                        <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#D8FF36]" : "text-[#151515]"}`}>
                          {formatPrice(g.basePrice)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] opacity-75">
                        <span>{g.gsm} GSM</span>
                        <span>•</span>
                        <span>{g.fit}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Garment Colour */}
            <div className="bg-white border border-[#E0DCD3] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#151515] flex items-center gap-2">
                  <span className="w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Garment Colour
                </h3>
                <span className="font-mono text-[11px] text-[#777] font-bold">{selectedColor.name}</span>
              </div>

              {/* Organized Category Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none font-mono text-[10px]">
                {["All", "Classic", "Streetwear", "Earthy", "Bold"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setColorCategory(cat)}
                    className={`px-2 py-1 uppercase whitespace-nowrap transition-colors border ${
                      colorCategory === cat
                        ? "bg-black text-[#D8FF36] border-black font-bold shadow-sm"
                        : "bg-[#FBF9F4] text-[#666] border-[#E5E0D6] hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Swatches Grid */}
              <div className="grid grid-cols-6 gap-2 max-h-[190px] overflow-y-auto pr-1">
                {filteredColors.map((c) => {
                  const isSelected = selectedColor.name === c.name;
                  const isLight =
                    c.hex === "#FFFFFF" ||
                    c.hex === "#FBFBFB" ||
                    c.hex === "#FAF9F6" ||
                    c.hex === "#FFFFF0" ||
                    c.hex === "#FFFDD0" ||
                    c.hex === "#D9C9B6" ||
                    c.hex === "#C2B280" ||
                    c.hex === "#E6E6FA" ||
                    c.hex === "#F4C2C2" ||
                    c.hex === "#FFF44F";
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={`${c.name} (${c.hex})`}
                      className={`relative aspect-square border transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-black scale-110 shadow-md ring-2 ring-[#D8FF36] z-10"
                          : "border-black/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${isLight ? "text-black" : "text-white"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#888] pt-2 border-t border-[#EAE6DF]">
                <span>HEX: <strong className="text-[#151515]">{selectedColor.hex}</strong></span>
                <span className="uppercase text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 font-bold">
                  {selectedColor.category}
                </span>
              </div>
            </div>

            {/* Step 3: Size & Quantity */}
            <div className="bg-white border border-[#E0DCD3] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#151515] flex items-center gap-2">
                  <span className="w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Size & Quantity
                </h3>
              </div>

              {/* Sizes */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#777] uppercase tracking-wider">Garment Size</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {SIZES.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2 text-center font-mono text-xs font-bold border transition-colors ${
                          isSelected
                            ? "bg-black text-[#D8FF36] border-black"
                            : "bg-[#FBF9F4] text-[#151515] border-[#D4D0C8] hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-[#777] uppercase tracking-wider">Quantity</label>
                  {discountRate > 0 && (
                    <span className="font-mono text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 font-bold uppercase">
                      {(discountRate * 100).toFixed(0)}% Bulk Discount
                    </span>
                  )}
                </div>
                <div className="flex items-center border border-[#D4D0C8] bg-[#FBF9F4]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-9 flex items-center justify-center text-sm font-bold border-r border-[#D4D0C8] hover:bg-[#EAE6DF]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="flex-1 text-center bg-transparent font-mono text-xs font-bold focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(100, q + 1))}
                    className="w-10 h-9 flex items-center justify-center text-sm font-bold border-l border-[#D4D0C8] hover:bg-[#EAE6DF]"
                  >
                    +
                  </button>
                </div>
                <div className="font-mono text-[10px] text-[#888] flex justify-between">
                  <span>5+ pcs: 10% OFF</span>
                  <span>10+ pcs: 15% OFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* CENTER PANEL: INTERACTIVE CANVAS STAGE (Cols: 5)     */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Stage Frame */}
            <div className="w-full bg-[#151515] border border-[#2D2D2D] p-5 shadow-2xl relative flex flex-col">
              {/* Calibration Header */}
              <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4 font-mono text-[11px] text-[#D8FF36]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D8FF36]" />
                  <span>{selectedGarment.gsm} GSM // {selectedColor.name.toUpperCase()}</span>
                </div>
                <span>
                  {activeView === "front"
                    ? FRONT_PLACEMENTS.find((p) => p.id === frontPlacement)?.name.split(" ")[0]
                    : BACK_PLACEMENTS.find((p) => p.id === backPlacement)?.name.split(" ")[0]}
                </span>
              </div>

              {/* View Selector Controls */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex p-1 bg-[#202020] border border-[#333333]">
                  <button
                    onClick={() => setActiveView("front")}
                    className={`px-4 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
                      activeView === "front"
                        ? "bg-[#D8FF36] text-black shadow"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    FRONT VIEW
                  </button>
                  <button
                    onClick={() => setActiveView("back")}
                    className={`px-4 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
                      activeView === "back"
                        ? "bg-[#D8FF36] text-black shadow"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    BACK VIEW
                  </button>
                </div>

                {/* View Tools */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowGuidelines((g) => !g)}
                    title="Toggle Printable Boundaries"
                    className={`p-1.5 border font-mono text-xs flex items-center gap-1 ${
                      showGuidelines
                        ? "bg-[#D8FF36]/20 border-[#D8FF36] text-[#D8FF36]"
                        : "bg-[#202020] border-[#333] text-[#777]"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">GRID</span>
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                    title="Zoom Out"
                    className="p-1.5 bg-[#202020] border border-[#333] text-white hover:bg-[#333]"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    title="Zoom In"
                    className="p-1.5 bg-[#202020] border border-[#333] text-white hover:bg-[#333]"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                    className="p-1.5 bg-[#202020] border border-[#333] text-white hover:bg-[#333]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Garment Stage Container */}
              <div
                className="relative aspect-square w-full bg-[#181818] border border-[#262626] overflow-hidden flex items-center justify-center p-4 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <GarmentModel
                  garmentId={selectedGarment.id}
                  view={activeView}
                  colorHex={selectedColor.hex}
                  placement={activeView === "front" ? frontPlacement : backPlacement}
                  finish={selectedFinish.id}
                  frontArtwork={frontArtwork}
                  backArtwork={backArtwork}
                  frontText={frontText}
                  backText={backText}
                  showGuidelines={showGuidelines}
                  onUpdateArtwork={handleUpdateArtwork}
                  onUpdateText={handleUpdateText}
                  interactive={true}
                />
              </div>

              {/* Interactive Stage Hint */}
              <div className="mt-3 text-center">
                <span className="font-mono text-[10px] text-[#777777] uppercase tracking-wider">
                  Drag artwork or text inside the dashed zone to reposition
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT PANEL: ARTWORK, TYPOGRAPHY & ORDER (Cols: 4)   */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customization Tabs */}
            <div className="bg-white border border-[#E0DCD3] shadow-sm">
              <div className="grid grid-cols-3 border-b border-[#EAE6DF] font-mono text-xs uppercase font-bold">
                <button
                  onClick={() => setActiveRightTab("artwork")}
                  className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeRightTab === "artwork"
                      ? "border-black text-black bg-[#FAF8F5]"
                      : "border-transparent text-[#777] hover:text-black"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Artwork
                </button>
                <button
                  onClick={() => setActiveRightTab("text")}
                  className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeRightTab === "text"
                      ? "border-black text-black bg-[#FAF8F5]"
                      : "border-transparent text-[#777] hover:text-black"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Text
                </button>
                <button
                  onClick={() => setActiveRightTab("specs")}
                  className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeRightTab === "specs"
                      ? "border-black text-black bg-[#FAF8F5]"
                      : "border-transparent text-[#777] hover:text-black"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Finish
                </button>
              </div>

              {/* Tab 1: Artwork Upload */}
              {activeRightTab === "artwork" && (
                <div className="p-5 space-y-5">
                  {/* Starter Design Template Mode */}
                  <div className="bg-[#111111] p-3.5 text-white border border-[#2A2A2A] space-y-2.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#888] uppercase tracking-wider">Quick Preset Template</span>
                      <span className="text-[#D8FF36]">INSTANT LOAD</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleStartWithBuildDesign}
                        className="py-2 px-2 bg-[#D8FF36] hover:bg-[#cbf720] text-black font-mono text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        BUILD Design
                      </button>
                      <button
                        onClick={handleStartFromBlank}
                        className="py-2 px-2 bg-[#222222] hover:bg-[#333333] text-white font-mono text-[11px] font-bold uppercase border border-[#444] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#888]" />
                        Start Blank
                      </button>
                    </div>
                  </div>

                  {/* Front Artwork Box */}
                  <div className="border border-[#E5E0D6] p-4 bg-[#FBF9F4] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                        FRONT ARTWORK
                      </span>
                      {frontArtwork.url && (
                        <button
                          onClick={() => setFrontArtwork((prev) => ({ ...prev, url: null, fileName: "" }))}
                          className="text-[#DC2626] hover:text-black text-xs font-mono flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    {frontArtwork.url ? (
                      <div className="flex items-center gap-3 bg-white p-2 border border-[#D4D0C8]">
                        <img
                          src={frontArtwork.url}
                          alt="Front Artwork"
                          className="w-12 h-12 object-contain border border-[#EEE] bg-[#111]"
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-mono text-xs truncate font-bold">{frontArtwork.fileName || "front_graphic.png"}</p>
                          <span className="font-mono text-[10px] text-[#2E7D32]">Uploaded & Saved</span>
                        </div>
                        <button
                          onClick={() => frontFileInputRef.current?.click()}
                          className="px-2 py-1 bg-[#151515] text-white text-[10px] font-mono uppercase font-bold"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => frontFileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#C5BFB5] hover:border-black p-5 text-center cursor-pointer transition-colors bg-white"
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-[#777]" />
                        <p className="font-mono text-xs font-bold uppercase text-[#151515]">Upload Front Image</p>
                        <p className="font-mono text-[10px] text-[#888] mt-1">PNG, JPG, WEBP, SVG (Max 25MB)</p>
                      </div>
                    )}

                    <input
                      ref={frontFileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      onChange={(e) => handleFileUpload(e, "front")}
                      className="hidden"
                    />

                    {/* Front Artwork Controls */}
                    {frontArtwork.url && (
                      <div className="space-y-2 pt-2 border-t border-[#EAE6DF]">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span>SCALE: {Math.round(frontArtwork.scale * 100)}%</span>
                          <span>ROTATION: {frontArtwork.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={0.3}
                          max={1.8}
                          step={0.05}
                          value={frontArtwork.scale}
                          onChange={(e) =>
                            setFrontArtwork((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
                          }
                          className="w-full accent-black cursor-pointer"
                        />
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          step={5}
                          value={frontArtwork.rotation}
                          onChange={(e) =>
                            setFrontArtwork((prev) => ({ ...prev, rotation: parseInt(e.target.value) }))
                          }
                          className="w-full accent-black cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Back Artwork Box */}
                  <div className="border border-[#E5E0D6] p-4 bg-[#FBF9F4] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                        BACK ARTWORK
                      </span>
                      {backArtwork.url && (
                        <button
                          onClick={() => setBackArtwork((prev) => ({ ...prev, url: null, fileName: "" }))}
                          className="text-[#DC2626] hover:text-black text-xs font-mono flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    {backArtwork.url ? (
                      <div className="flex items-center gap-3 bg-white p-2 border border-[#D4D0C8]">
                        <img
                          src={backArtwork.url}
                          alt="Back Artwork"
                          className="w-12 h-12 object-contain border border-[#EEE] bg-[#111]"
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-mono text-xs truncate font-bold">{backArtwork.fileName || "back_graphic.png"}</p>
                          <span className="font-mono text-[10px] text-[#2E7D32]">Uploaded & Saved</span>
                        </div>
                        <button
                          onClick={() => backFileInputRef.current?.click()}
                          className="px-2 py-1 bg-[#151515] text-white text-[10px] font-mono uppercase font-bold"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => backFileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#C5BFB5] hover:border-black p-5 text-center cursor-pointer transition-colors bg-white"
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-[#777]" />
                        <p className="font-mono text-xs font-bold uppercase text-[#151515]">Upload Back Image</p>
                        <p className="font-mono text-[10px] text-[#888] mt-1">PNG, JPG, WEBP, SVG (Max 25MB)</p>
                      </div>
                    )}

                    <input
                      ref={backFileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      onChange={(e) => handleFileUpload(e, "back")}
                      className="hidden"
                    />

                    {/* Back Artwork Controls */}
                    {backArtwork.url && (
                      <div className="space-y-2 pt-2 border-t border-[#EAE6DF]">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span>SCALE: {Math.round(backArtwork.scale * 100)}%</span>
                          <span>ROTATION: {backArtwork.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min={0.3}
                          max={1.8}
                          step={0.05}
                          value={backArtwork.scale}
                          onChange={(e) =>
                            setBackArtwork((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
                          }
                          className="w-full accent-black cursor-pointer"
                        />
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          step={5}
                          value={backArtwork.rotation}
                          onChange={(e) =>
                            setBackArtwork((prev) => ({ ...prev, rotation: parseInt(e.target.value) }))
                          }
                          className="w-full accent-black cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Feedback Alerts */}
                  {uploadLoading && (
                    <div className="p-3 bg-[#D8FF36]/20 border border-[#BCE81B] font-mono text-xs flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Uploading & Calibrating high-res artwork...
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {uploadError}
                    </div>
                  )}

                  {resWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-800 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {resWarning}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Custom Text */}
              {activeRightTab === "text" && (
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-bold uppercase text-[#151515]">
                      {activeView.toUpperCase()} Custom Text
                    </label>
                    <input
                      type="text"
                      placeholder="ENTER STREETWEAR TEXT..."
                      value={activeView === "front" ? frontText.text : backText.text}
                      onChange={(e) =>
                        handleUpdateText(activeView, { text: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2.5 border border-[#D4D0C8] font-mono text-xs uppercase font-bold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Font Style */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-[#777] uppercase tracking-wider">Font Family</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TEXT_FONTS.map((f) => {
                        const currentFont = activeView === "front" ? frontText.font : backText.font;
                        const isSelected = currentFont === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => handleUpdateText(activeView, { font: f.id })}
                            className={`p-2 border text-left font-mono text-xs transition-colors ${
                              isSelected
                                ? "bg-black text-[#D8FF36] border-black font-bold"
                                : "bg-[#FBF9F4] text-[#151515] border-[#D4D0C8] hover:border-black"
                            }`}
                          >
                            {f.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Color */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-[#777] uppercase tracking-wider">Text Color</label>
                    <div className="flex gap-2">
                      {TEXT_COLORS.map((tc) => {
                        const currentColor = activeView === "front" ? frontText.color : backText.color;
                        const isSelected = currentColor === tc.hex;
                        return (
                          <button
                            key={tc.name}
                            onClick={() => handleUpdateText(activeView, { color: tc.hex })}
                            title={tc.name}
                            className={`w-7 h-7 rounded-full border-2 transition-transform ${
                              isSelected ? "border-black scale-110 ring-2 ring-[#D8FF36]" : "border-black/30"
                            }`}
                            style={{ backgroundColor: tc.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size & Rotation */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-[#777] mb-1">
                        <span>SIZE</span>
                        <span>{activeView === "front" ? frontText.fontSize : backText.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={54}
                        value={activeView === "front" ? frontText.fontSize : backText.fontSize}
                        onChange={(e) =>
                          handleUpdateText(activeView, { fontSize: parseInt(e.target.value) })
                        }
                        className="w-full accent-black cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[10px] text-[#777] mb-1">
                        <span>ROTATION</span>
                        <span>{activeView === "front" ? frontText.rotation : backText.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step={5}
                        value={activeView === "front" ? frontText.rotation : backText.rotation}
                        onChange={(e) =>
                          handleUpdateText(activeView, { rotation: parseInt(e.target.value) })
                        }
                        className="w-full accent-black cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Print Placement & Finish */}
              {activeRightTab === "specs" && (
                <div className="p-5 space-y-5">
                  {/* Print Side */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#151515]">Print Sides</label>
                    <div className="space-y-1.5">
                      {PRINT_SIDES.map((ps) => {
                        const isSelected = printSide === ps.id;
                        return (
                          <button
                            key={ps.id}
                            onClick={() => setPrintSide(ps.id)}
                            className={`w-full text-left p-2.5 border transition-all flex items-center justify-between font-mono text-xs ${
                              isSelected
                                ? "bg-black text-white border-black font-bold ring-1 ring-[#D8FF36]"
                                : "bg-[#FBF9F4] text-[#151515] border-[#D4D0C8] hover:border-black"
                            }`}
                          >
                            <span>{ps.name}</span>
                            <span className={isSelected ? "text-[#D8FF36]" : "text-[#777]"}>
                              {ps.extra === 0 ? "INCLUDED" : `+${formatPrice(ps.extra)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Print Placement Zone */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#151515]">
                      {activeView === "front" ? "Front Placement" : "Back Placement"}
                    </label>
                    <div className="space-y-1.5">
                      {(activeView === "front" ? FRONT_PLACEMENTS : BACK_PLACEMENTS).map((pl) => {
                        const currentPlacement = activeView === "front" ? frontPlacement : backPlacement;
                        const isSelected = currentPlacement === pl.id;
                        return (
                          <button
                            key={pl.id}
                            onClick={() => {
                              if (activeView === "front") setFrontPlacement(pl.id);
                              else setBackPlacement(pl.id);
                            }}
                            className={`w-full text-left p-2.5 border transition-all font-mono text-xs ${
                              isSelected
                                ? "bg-black text-[#D8FF36] border-black font-bold"
                                : "bg-[#FBF9F4] text-[#151515] border-[#D4D0C8] hover:border-black"
                            }`}
                          >
                            {pl.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ink Finish */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[#151515]">Ink Finish & Texture</label>
                    <div className="space-y-1.5">
                      {FINISHES.map((fn) => {
                        const isSelected = selectedFinish.id === fn.id;
                        return (
                          <button
                            key={fn.id}
                            onClick={() => setSelectedFinish(fn)}
                            className={`w-full text-left p-2.5 border transition-all font-mono text-xs ${
                              isSelected
                                ? "bg-black text-white border-black ring-1 ring-[#D8FF36]"
                                : "bg-[#FBF9F4] text-[#151515] border-[#D4D0C8] hover:border-black"
                            }`}
                          >
                            <div className="flex justify-between font-bold">
                              <span>{fn.name}</span>
                              <span className={isSelected ? "text-[#D8FF36]" : "text-[#777]"}>
                                {fn.extra === 0 ? "STANDARD" : `+${formatPrice(fn.extra)}`}
                              </span>
                            </div>
                            <p className="text-[10px] opacity-70 mt-1">{fn.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-[#151515] text-white p-5 border border-[#333] shadow-lg space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 text-xs uppercase font-bold text-[#D8FF36]">
                <span>ORDER ESTIMATE</span>
                <span>{quantity} {quantity === 1 ? "PIECE" : "PIECES"}</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#999]">
                <div className="flex justify-between">
                  <span>{selectedGarment.name} (Base)</span>
                  <span className="text-white">{formatPrice(selectedGarment.basePrice)}</span>
                </div>
                {selectedPrintSideObj.extra > 0 && (
                  <div className="flex justify-between">
                    <span>{selectedPrintSideObj.name} Surcharge</span>
                    <span className="text-white">+{formatPrice(selectedPrintSideObj.extra)}</span>
                  </div>
                )}
                {selectedFinish.extra > 0 && (
                  <div className="flex justify-between">
                    <span>{selectedFinish.name.split(" ")[0]} Finish</span>
                    <span className="text-white">+{formatPrice(selectedFinish.extra)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-[#2A2A2A] text-white font-bold">
                  <span>Unit Price</span>
                  <span>{formatPrice(unitPrice)}</span>
                </div>
                {volumeDiscount > 0 && (
                  <div className="flex justify-between text-[#D8FF36]">
                    <span>Volume Discount ({(discountRate * 100).toFixed(0)}%)</span>
                    <span>-{formatPrice(volumeDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#333] flex justify-between items-baseline">
                <span className="text-xs uppercase text-[#888] font-bold">TOTAL AMOUNT</span>
                <span className="font-display text-2xl font-black text-[#D8FF36]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#D8FF36] hover:bg-[#C2E82E] text-black font-mono font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedToast ? "ADDED TO CART!" : "ADD TO CART"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-white hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <span>BUY NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#777] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D8FF36]" />
                <span>Zero Risk • Dispatched within 48 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL DESIGN PREVIEW MODAL                                */}
      {/* ======================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#151515] border border-[#333] max-w-4xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <div>
                <h2 className="font-display text-xl uppercase font-black text-[#D8FF36]">
                  DESIGN ARCHIVE PROTOTYPE
                </h2>
                <p className="font-mono text-xs text-[#888]">
                  {selectedGarment.name} • {selectedColor.name} • {selectedSize}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 bg-[#252525] hover:bg-[#333] font-mono text-xs uppercase font-bold"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* Dual Front & Back View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#101010] border border-[#252525] p-4 flex flex-col items-center">
                <span className="font-mono text-xs text-[#D8FF36] mb-2 font-bold uppercase">FRONT VIEW</span>
                <div className="w-full aspect-square max-h-[300px]">
                  <GarmentModel
                    garmentId={selectedGarment.id}
                    view="front"
                    colorHex={selectedColor.hex}
                    placement={frontPlacement}
                    finish={selectedFinish.id}
                    frontArtwork={frontArtwork}
                    backArtwork={backArtwork}
                    frontText={frontText}
                    backText={backText}
                    showGuidelines={false}
                    interactive={false}
                  />
                </div>
              </div>

              <div className="bg-[#101010] border border-[#252525] p-4 flex flex-col items-center">
                <span className="font-mono text-xs text-[#D8FF36] mb-2 font-bold uppercase">BACK VIEW</span>
                <div className="w-full aspect-square max-h-[300px]">
                  <GarmentModel
                    garmentId={selectedGarment.id}
                    view="back"
                    colorHex={selectedColor.hex}
                    placement={backPlacement}
                    finish={selectedFinish.id}
                    frontArtwork={frontArtwork}
                    backArtwork={backArtwork}
                    frontText={frontText}
                    backText={backText}
                    showGuidelines={false}
                    interactive={false}
                  />
                </div>
              </div>
            </div>

            {/* Spec Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1B1B1B] p-4 font-mono text-xs">
              <div>
                <span className="text-[#777] block text-[10px]">SILHOUETTE</span>
                <span className="font-bold">{selectedGarment.name}</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px]">FABRIC</span>
                <span className="font-bold">{selectedGarment.gsm} GSM Cotton</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px]">PRINT FINISH</span>
                <span className="font-bold">{selectedFinish.name.split(" ")[0]}</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px]">TOTAL PRICE</span>
                <span className="font-bold text-[#D8FF36]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleAddToCart();
                  setIsPreviewOpen(false);
                }}
                className="flex-1 py-3 bg-[#D8FF36] text-black font-mono font-black text-xs uppercase tracking-wider"
              >
                PROCEED WITH THIS DESIGN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
