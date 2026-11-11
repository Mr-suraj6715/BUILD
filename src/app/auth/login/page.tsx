"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleQuickLogin = async (userType: "customer" | "admin") => {
    setError(null);
    setLoading(true);

    const creds =
      userType === "admin"
        ? { email: "admin@buildclothing.com", pass: "Admin@123456", dest: "/admin" }
        : { email: "customer@buildclothing.com", pass: "Customer@123456", dest: "/account" };

    const res = await login(creds.email, creds.pass);
    setLoading(false);

    if (res.success) {
      router.push(creds.dest);
    } else {
      setError(res.error || "Quick login failed");
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
            SIGN IN TO YOUR ACCOUNT
          </h2>
          <p className="text-xs text-[#777777] mt-1">
            Access your orders, saved fits, and private drop invitations.
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
              Email Address
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
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-8 pt-6 border-t border-[#D4D0C8]">
          <span className="text-[10px] font-mono uppercase text-[#777777] block text-center mb-3">
            ONE-CLICK DEMO CREDENTIALS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("customer")}
              className="py-2 px-3 bg-[#F5F3EE] border border-[#D4D0C8] text-[11px] font-bold uppercase tracking-wider text-[#151515] hover:bg-[#101010] hover:text-[#D8FF36] transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
            <button
              onClick={() => handleQuickLogin("admin")}
              className="py-2 px-3 bg-[#101010] text-[#D8FF36] text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#555555]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-bold text-[#151515] underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

