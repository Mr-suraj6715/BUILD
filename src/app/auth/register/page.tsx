"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 w-full min-h-[80vh] flex flex-col justify-center">
      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-8 shadow-xl">
        <div className="text-center mb-8">
          <span className="font-display text-4xl uppercase font-black tracking-wider text-[#151515]">
            BUILD<span className="text-[#101010]">.</span>
          </span>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mt-2">
            JOIN BUILD CLOTHING
          </h2>
          <p className="text-xs text-[#777777] mt-1">
            Create an account to track orders and gain early drop access.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-700 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Siddharth Rao"
                className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
              <User className="w-4 h-4 text-[#777777] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
              <Mail className="w-4 h-4 text-[#777777] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
              <Phone className="w-4 h-4 text-[#777777] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
              />
              <Lock className="w-4 h-4 text-[#777777] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border border-[#101010]"
          >
            <span>{loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#555555]">
          Already registered?{" "}
          <Link href="/auth/login" className="font-bold text-[#151515] underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

