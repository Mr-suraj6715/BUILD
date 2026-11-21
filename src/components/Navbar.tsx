"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Heart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle sticky header scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Main navigation sequence per design specification
  interface NavLinkItem {
    name: string;
    href: string;
    badge?: string;
  }

  const navLinks: NavLinkItem[] = [
    { name: "HOME", href: "/" },
    { name: "COLLECTIONS", href: "/shop?collection=the-build-series" },
    { name: "CUSTOM PRINT", href: "/custom-print" },
    { name: "LOOKBOOK", href: "/#lookbook" },
    { name: "ABOUT", href: "/#story" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href.split("?")[0]);
  };

  // Determine styling based on whether on homepage and whether scrolled
  const isLightText = isHome; // Always white on homepage (either transparent over video or dark scrolled navbar)
  const headerClasses = isHome
    ? `fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 border-none ${isScrolled
      ? "bg-[#101010]/95 backdrop-blur-md shadow-xl py-0 text-white"
      : "bg-transparent text-white"
    }`
    : `sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled
      ? "bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#E8E5DE] shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-[#151515]"
      : "bg-[#F5F3EE] border-b border-[#E8E5DE] text-[#151515]"
    }`;

  return (
    <>
      <header className={headerClasses}>
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
          {/* ======================================================== */}
          {/* LEFT SECTION — BRAND IDENTITY                            */}
          {/* Official BUILD Mountain Wordmark Logo                    */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="group flex items-center focus:outline-none py-1"
              aria-label="BUILD Homepage"
            >
              <img
                src={isLightText ? "/images/build-logo-white.png" : "/images/build-logo-dark.png"}
                alt="BUILD"
                className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* ======================================================== */}
          {/* CENTER SECTION — MAIN NAVIGATION                         */}
          {/* HOME | SHOP | COLLECTIONS | CUSTOM PRINT | LOOKBOOK | ABOUT */}
          {/* ======================================================== */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-7"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[12px] xl:text-[13px] uppercase font-bold tracking-[0.14em] transition-colors relative py-1.5 flex items-center gap-1.5 focus:outline-none ${isLightText
                    ? active
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                    : active
                      ? "text-[#151515]"
                      : "text-[#151515]/70 hover:text-[#151515]"
                    } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] ${isLightText ? "after:bg-[#D8FF36]" : "after:bg-[#151515]"
                    } ${active ? "after:scale-x-100" : "after:scale-x-0"
                    } hover:after:scale-x-100 after:transition-transform after:duration-200`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-[#D8FF36] text-[#151515] font-mono text-[9px] px-1.5 py-0.5 font-black uppercase tracking-wider rounded-[2px] shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ======================================================== */}
          {/* RIGHT SECTION — ACTION ICONS                             */}
          {/* Exact sequence: Search, Account, Wishlist, Cart          */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 1. Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 transition-colors rounded-full focus:outline-none ${isLightText
                ? "text-white hover:text-[#D8FF36] hover:bg-white/10"
                : "text-[#151515] hover:text-black hover:bg-[#E8E5DE]/60"
                }`}
              aria-label="Search Catalog"
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" strokeWidth={1.8} />
            </button>

            {/* 2. Account */}
            <Link
              href={user ? "/account" : "/auth/login"}
              className={`p-2 transition-colors rounded-full focus:outline-none ${isLightText
                ? "text-white hover:text-[#D8FF36] hover:bg-white/10"
                : "text-[#151515] hover:text-black hover:bg-[#E8E5DE]/60"
                }`}
              aria-label={user ? `Account (${user.name})` : "Account Login"}
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </Link>

            {/* 3. Wishlist */}
            <Link
              href="/shop?filter=featured"
              className={`p-2 transition-colors rounded-full focus:outline-none ${isLightText
                ? "text-white hover:text-[#D8FF36] hover:bg-white/10"
                : "text-[#151515] hover:text-black hover:bg-[#E8E5DE]/60"
                }`}
              aria-label="Wishlist"
              title="Saved Items / Wishlist"
            >
              <Heart className="w-5 h-5" strokeWidth={1.8} />
            </Link>

            {/* 4. Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative p-2 transition-colors rounded-full focus:outline-none ${isLightText
                ? "text-white hover:text-[#D8FF36] hover:bg-white/10"
                : "text-[#151515] hover:text-black hover:bg-[#E8E5DE]/60"
                }`}
              aria-label={`Shopping Bag (${totalItems} items)`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#D8FF36] text-[#151515] text-[10px] font-bold font-mono h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 lg:hidden rounded-full focus:outline-none ml-0.5 ${isLightText
                ? "text-white hover:text-[#D8FF36] hover:bg-white/10"
                : "text-[#151515] hover:text-black hover:bg-[#E8E5DE]/60"
                }`}
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EXPANDABLE MINIMAL SEARCH BAR                            */}
        {/* ======================================================== */}
        {searchOpen && (
          <div
            className={`border-t px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-150 ${isLightText
              ? "border-[#262626] bg-[#121212]/95 backdrop-blur-md text-white"
              : "border-[#E8E5DE] bg-[#F5F3EE] text-[#151515]"
              }`}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLightText ? "text-[#AAAAAA]" : "text-[#777777]"
                    }`}
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH GRAPHIC TEES, HOODIES, DROPS..."
                  autoFocus
                  className={`w-full pl-10 pr-4 py-2 font-mono text-xs uppercase tracking-wider border rounded-none focus:outline-none transition-colors ${isLightText
                    ? "bg-[#1E1E1E] text-white border-[#333333] placeholder-[#888888] focus:border-[#D8FF36]"
                    : "bg-white text-[#151515] border-[#D4D0C8] placeholder-[#999999] focus:border-black"
                    }`}
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#D8FF36] text-[#151515] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shrink-0"
              >
                SEARCH
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className={`p-2 transition-colors shrink-0 ${isLightText
                  ? "text-[#AAAAAA] hover:text-white"
                  : "text-[#777777] hover:text-[#151515]"
                  }`}
                aria-label="Close search"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* RESPONSIVE MOBILE NAVIGATION DRAWER                      */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <div className="relative w-full max-w-xs bg-[#121212] text-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 border-r border-[#262626]">
            <div>
              {/* Header with BUILD Logo and Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
                <div className="flex items-center">
                  <img
                    src="/images/build-logo-white.png"
                    alt="BUILD"
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#AAAAAA] hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>

              {/* Navigation Links in exact required order */}
              <nav className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm uppercase font-bold tracking-wider py-3 px-3 rounded-sm transition-colors flex items-center justify-between ${active
                        ? "bg-[#222222] text-[#D8FF36]"
                        : "text-[#CCCCCC] hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="bg-[#D8FF36] text-[#151515] font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider rounded-[2px]">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#262626] space-y-3">
              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-3 bg-[#D8FF36] text-[#151515] font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
              >
                {user ? "My Account" : "Sign In / Join"}
              </Link>
              {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-2.5 bg-[#1F1F1F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors border border-white/10"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
