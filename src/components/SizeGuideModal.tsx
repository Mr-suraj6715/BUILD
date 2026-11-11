"use client";

import React, { useState } from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  fitType?: string;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  fitType = "Oversized Boxy Fit",
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  if (!isOpen) return null;

  const measurements = {
    inches: [
      { size: "S", chest: '44"', length: '28"', shoulder: '21"', sleeve: '8.5"' },
      { size: "M", chest: '46"', length: '29"', shoulder: '22"', sleeve: '9.0"' },
      { size: "L", chest: '48"', length: '30"', shoulder: '23"', sleeve: '9.5"' },
      { size: "XL", chest: '50"', length: '31"', shoulder: '24"', sleeve: '10.0"' },
      { size: "XXL", chest: '52"', length: '32"', shoulder: '25"', sleeve: '10.5"' },
    ],
    cm: [
      { size: "S", chest: "112 cm", length: "71 cm", shoulder: "53 cm", sleeve: "21.5 cm" },
      { size: "M", chest: "117 cm", length: "74 cm", shoulder: "56 cm", sleeve: "23 cm" },
      { size: "L", chest: "122 cm", length: "76 cm", shoulder: "58 cm", sleeve: "24 cm" },
      { size: "XL", chest: "127 cm", length: "79 cm", shoulder: "61 cm", sleeve: "25.5 cm" },
      { size: "XXL", chest: "132 cm", length: "81 cm", shoulder: "63 cm", sleeve: "26.5 cm" },
    ],
  };

  const rows = unit === "inches" ? measurements.inches : measurements.cm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F3EE] border border-[#151515] w-full max-w-xl p-6 sm:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#151515] hover:text-black hover:bg-[#E8E5DE] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-6 h-6 text-[#151515]" />
          <div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-[#151515] font-bold">
              SIZE GUIDE — {fitType.toUpperCase()}
            </h3>
            <p className="text-xs text-[#777777]">
              Engineered drop-shoulder silhouette. Choose true to size for signature baggy fit.
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-end mb-4">
          <div className="inline-flex border border-[#151515] p-0.5 bg-[#E8E5DE]">
            <button
              onClick={() => setUnit("inches")}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                unit === "inches"
                  ? "bg-[#151515] text-[#D8FF36]"
                  : "text-[#151515] hover:bg-[#D4D0C8]"
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                unit === "cm"
                  ? "bg-[#151515] text-[#D8FF36]"
                  : "text-[#151515] hover:bg-[#D4D0C8]"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase font-mono border-collapse">
            <thead>
              <tr className="bg-[#101010] text-[#D8FF36]">
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Chest Width</th>
                <th className="py-3 px-3">Length</th>
                <th className="py-3 px-3">Shoulder</th>
                <th className="py-3 px-3">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4D0C8]">
              {rows.map((row) => (
                <tr key={row.size} className="hover:bg-[#E8E5DE]">
                  <td className="py-3 px-3 font-bold text-[#151515]">{row.size}</td>
                  <td className="py-3 px-3 text-[#151515]">{row.chest}</td>
                  <td className="py-3 px-3 text-[#151515]">{row.length}</td>
                  <td className="py-3 px-3 text-[#151515]">{row.shoulder}</td>
                  <td className="py-3 px-3 text-[#151515]">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-3 bg-[#E8E5DE] border border-[#D4D0C8] text-[11px] text-[#555555]">
          <strong>Model Spec:</strong> 6&apos;1&quot; (185 cm) wearing size XL for an oversized streetwear look. If you prefer a tailored regular fit, size down once.
        </div>
      </div>
    </div>
  );
}

