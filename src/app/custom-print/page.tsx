"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Upload, Check, ShoppingBag, Sparkles, Layers, Sliders, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CustomPrintStudioPage() {
  const { addToCart } = useCart();

  const blanks = [
    { id: "oversized-280", name: "Tokyo Boxy Oversized Blank", gsm: 280, price: 1899 },
    { id: "standard-240", name: "Heavyweight Core Blank", gsm: 240, price: 1699 },
    { id: "luxury-320", name: "Industrial Heavyweight 320 GSM", gsm: 320, price: 2199 },
  ];

  const colors = [
    { name: "Washed Charcoal", hex: "#242424" },
    { name: "Pristine Bone", hex: "#E8E5DE" },
    { name: "Deep Onyx", hex: "#111111" },
    { name: "Acid Slate", hex: "#4D5359" },
    { name: "Military Olive", hex: "#383A2D" },
  ];

  const placements = [
    { id: "front", name: "Chest Center (300×400mm)" },
    { id: "back", name: "Massive Full Back (400×500mm)" },
    { id: "pocket", name: "Left Breast Pocket Hit" },
    { id: "sleeve", name: "Dual Sleeve Coordinates" },
  ];

  const finishes = [
    { id: "dtg", name: "Ultra-HD Kornit DTG (1200 DPI)", extra: 0 },
    { id: "puff", name: "Tactile 3D Puff Screenprint", extra: 200 },
    { id: "metallic", name: "Cyber Foil / Reflective Ink", extra: 350 },
  ];

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const [selectedBlank, setSelectedBlank] = useState(blanks[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(placements[1]);
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const totalPrice = selectedBlank.price + selectedFinish.extra;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      variantId: `custom-${Date.now()}`,
      productId: `custom-${selectedBlank.id}`,
      title: `CUSTOM // ${selectedBlank.name}`,
      slug: "custom-print",
      image: uploadedImage || "/images/stitch/custom-mockup.png",
      price: totalPrice,
      originalPrice: totalPrice + 500,
      size: selectedSize,
      color: selectedColor.name,
      quantity: 1,
      maxStock: 50,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#666666] hover:text-[#151515]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO ARCHIVE</span>
          </Link>
          <span className="font-mono text-xs bg-[#D8FF36] text-[#151515] px-2.5 py-1 font-bold uppercase tracking-widest">
            PRINT LAB v4.2 // LIVE CALIBRATION
          </span>
        </div>

        {/* Studio Header */}
        <div className="mb-10 border-b border-[#D4D0C8] pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#536500] uppercase font-bold tracking-widest mb-1">
            <span className="w-2 h-2 bg-[#536500]" />
            BESPOKE STREETWEAR ENGINE
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515]">
            BUILD CUSTOM PRINT STUDIO
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#666666] max-w-2xl mt-2">
            Upload original vector artwork, configure luxury blank silhouettes, specify ink finish,
            and preview your garment in real-time. Single piece dispatch or collection capsules.
          </p>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas Preview (Span 7) */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="bg-[#151515] p-6 shadow-2xl border border-[#333333] relative overflow-hidden">
              {/* Calibration Header */}
              <div className="flex items-center justify-between font-mono text-[11px] text-[#D8FF36] border-b border-[#262626] pb-3 mb-6">
                <span>SIMULATION // {selectedBlank.gsm} GSM</span>
                <span>{selectedPlacement.name}</span>
                <span>FINISH: {selectedFinish.name.split(" ")[0]}</span>
              </div>

              {/* Garment Mockup Container */}
              <div className="relative aspect-square w-full bg-[#1D1C16] flex items-center justify-center p-6 border border-[#2E2D27] overflow-hidden">
                {/* Blueprint Crosshairs */}
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>

                {/* Base Garment Mockup */}
                <img
                  src="/images/stitch/custom-mockup.png"
                  alt="Garment Blank Mockup"
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  style={{
                    filter: `brightness(${selectedColor.hex === "#E8E5DE" ? 1.6 : 0.9})`,
                  }}
                />

                {/* Color Overlay Tint */}
                <div
                  className="absolute inset-0 mix-blend-color opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedColor.hex }}
                />

                {/* Custom Uploaded Graphic Overlay */}
                {uploadedImage && (
                  <div
                    className={`absolute z-20 pointer-events-none ${
                      selectedPlacement.id === "front"
                        ? "w-44 h-44 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4"
                        : selectedPlacement.id === "back"
                        ? "w-60 h-60 top-1/4 left-1/2 -translate-x-1/2"
                        : selectedPlacement.id === "pocket"
                        ? "w-20 h-20 top-1/3 left-1/3"
                        : "w-24 h-48 top-1/3 left-1/4"
                    } flex items-center justify-center`}
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded Graphic Artwork"
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>
                )}

                {/* Custom Slogan Typography Overlay */}
                {customText && (
                  <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                    <span className="font-display text-2xl sm:text-4xl uppercase tracking-widest text-[#D8FF36] drop-shadow-lg font-black block">
                      {customText}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/80">
                      BUILD // TOKYO ARCHIVE
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Canvas Specs */}
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#888888] uppercase">
                <span>CANVAS 400 × 500 MM • ZERO MINIMUM</span>
                <span className="text-[#D8FF36]">READY FOR KORNIT DIRECT DISPATCH</span>
              </div>
            </div>
          </div>

          {/* Right Controls Panel (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Blank Silhouette Selection */}
            <div className="bg-white p-5 shadow-sm border border-[#E8E5DE]">
              <h3 className="font-mono text-xs font-bold text-[#151515] uppercase tracking-wider mb-3">
                1. SELECT GARMENT SILHOUETTE
              </h3>
              <div className="space-y-2">
                {blanks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBlank(b)}
                    className={`w-full p-3 text-left flex items-center justify-between border transition-all ${
                      selectedBlank.id === b.id
                        ? "border-[#151515] bg-[#F5F3EE] font-bold"
                        : "border-[#E8E5DE] hover:border-black"
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs text-[#151515]">{b.name}</div>
                      <div className="font-mono text-[10px] text-[#666666]">{b.gsm} GSM Dense Weave</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-[#151515]">₹{b.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colorway Selection */}
            <div className="bg-white p-5 shadow-sm border border-[#E8E5DE]">
              <h3 className="font-mono text-xs font-bold text-[#151515] uppercase tracking-wider mb-3">
                2. CHOOSE COLORWAY ({selectedColor.name})
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-none border-2 flex items-center justify-center transition-transform ${
                      selectedColor.name === c.name
                        ? "border-[#151515] scale-110 shadow-md"
                        : "border-[#D4D0C8] hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check
                        className={`w-4 h-4 ${
                          c.hex === "#E8E5DE" ? "text-black" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Artwork Uploader & Typography */}
            <div className="bg-white p-5 shadow-sm border border-[#E8E5DE]">
              <h3 className="font-mono text-xs font-bold text-[#151515] uppercase tracking-wider mb-3">
                3. UPLOAD ARTWORK OR ENTER TEXT
              </h3>

              <div className="space-y-4">
                <label className="border-2 border-dashed border-[#D4D0C8] hover:border-[#151515] p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FBF9F4]">
                  <Upload className="w-6 h-6 text-[#666666] mb-2" />
                  <span className="font-mono text-xs text-[#151515] font-bold uppercase">
                    UPLOAD VECTOR / PNG (MAX 25MB)
                  </span>
                  <span className="font-mono text-[10px] text-[#888888] mt-1">
                    Transparent background recommended (300+ DPI)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImage && (
                  <div className="flex items-center justify-between bg-[#F5F3EE] p-2 px-3 font-mono text-xs border border-[#E8E5DE]">
                    <span className="text-[#536500] font-bold">✓ Artwork Attached</span>
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-[#BA1A1A] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[11px] text-[#666666] uppercase mb-1">
                    ADD STREETWEAR TEXT HIT:
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. TOKYO ANARCHY"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-display text-lg tracking-wider uppercase text-[#151515] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Print Placement & Ink Finish */}
            <div className="bg-white p-5 shadow-sm border border-[#E8E5DE]">
              <h3 className="font-mono text-xs font-bold text-[#151515] uppercase tracking-wider mb-3">
                4. PLACEMENT &amp; INK TACTILITY
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {placements.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlacement(p)}
                    className={`p-2 font-mono text-[11px] text-left border ${
                      selectedPlacement.id === p.id
                        ? "border-[#151515] bg-[#F5F3EE] font-bold"
                        : "border-[#E8E5DE]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E8E5DE]">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFinish(f)}
                    className={`w-full p-2.5 font-mono text-xs flex items-center justify-between border ${
                      selectedFinish.id === f.id
                        ? "border-[#151515] bg-[#F5F3EE] font-bold"
                        : "border-[#E8E5DE]"
                    }`}
                  >
                    <span>{f.name}</span>
                    <span>{f.extra > 0 ? `+₹${f.extra}` : "Included"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Add to Cart */}
            <div className="bg-white p-5 shadow-sm border border-[#E8E5DE] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#151515] uppercase">
                  5. SELECT SIZE:
                </span>
                <span className="font-mono text-xs text-[#536500] font-bold">BOXY JAPANESE CUT</span>
              </div>

              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 py-2 font-mono text-xs uppercase font-bold border ${
                      selectedSize === s
                        ? "bg-[#151515] text-[#D8FF36] border-[#151515]"
                        : "bg-[#F5F3EE] text-[#151515] border-[#D4D0C8] hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Price & Checkout Action */}
              <div className="pt-3 border-t border-[#E8E5DE] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase block">
                    TOTAL INVESTMENT:
                  </span>
                  <span className="font-display text-3xl font-black text-[#151515]">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#D8FF36] text-[#151515] hover:bg-black hover:text-[#D8FF36] font-display text-lg px-6 py-3 uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>ADDED TO CART!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>PRODUCE PIECE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

