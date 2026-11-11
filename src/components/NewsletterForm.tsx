"use client";

import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "loading">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("success");
    }
  };

  return (
    <div className="w-full md:w-auto md:min-w-[340px] flex flex-col gap-2">
      {status === "success" ? (
        <div className="bg-[#D8FF36] text-[#151515] font-mono text-xs p-3 font-bold uppercase tracking-wider text-center">
          ✓ OPERATOR REGISTERED ON VIP DISPATCH
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-stretch bg-white">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ADDRESS"
            className="w-full bg-transparent px-4 py-3 font-mono text-xs text-[#151515] placeholder:text-[#888888] focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#D8FF36] text-[#151515] font-mono text-xs font-bold px-6 uppercase hover:bg-white transition-colors shrink-0 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "JOIN"}
          </button>
        </form>
      )}
      <div className="flex items-center justify-between font-mono text-[10px] text-[#888888] uppercase px-1">
        <span>NO SPAM. ONLY DROPS.</span>
        <span>UNSUBSCRIBE ANYTIME</span>
      </div>
    </div>
  );
}

