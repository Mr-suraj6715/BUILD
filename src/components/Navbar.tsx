"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle sticky header scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "COLLECTIONS", href: "/shop?collection=oversized-edit" },
    { name: "CUSTOM PRINT", href: "/custom-print", badge: "STUDIO" },
    { name: "LOOKBOOK", href: "/#lookbook" },
    { name: "ABOUT", href: "/#story" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0].split("#")[0]);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#E8E5DE] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            : "bg-[#F5F3EE] border-b border-[#E8E5DE]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* ======================================================== */}
          {/* LEFT SECTION — BRAND IDENTITY                            */}
          {/* ======================================================== */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-3 focus:outline-none"
              aria-label="BUILD CLOTHING Homepage"
            >
              {/* Premium Vector Monogram Emblem */}
              <div className="w-8 h-8 rounded-[2px] bg-[#151515] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 9H23.5C27.0899 9 30 11.9101 30 15.5C30 17.8546 28.7497 19.9174 26.8837 21.0506C29.3496 22.148 31 24.6226 31 27.5C31 31.6421 27.6421 35 23.5 35H11V9ZM17 14.5V19.5H23C24.3807 19.5 25.5 18.3807 25.5 17C25.5 15.6193 24.3807 14.5 23 14.5H17ZM17 24.5V29.5H23.5C24.8807 29.5 26 28.3807 26 27C26 25.6193 24.8807 24.5 23.5 24.5H17Z"
                    fill="#F5F3EE"
                  />
                  <rect x="33" y="9" width="4" height="4" fill="#D8FF36" />
                </svg>
              </div>

              {/* Brand Name Typography */}
              <span className="font-display text-2xl sm:text-[26px] tracking-wider text-[#151515] uppercase font-black leading-none transition-colors group-hover:text-black">
                BUILD CLOTHING
              </span>
            </Link>
          </div>

          {/* ======================================================== */}
          {/* CENTER SECTION — MAIN NAVIGATION                         */}
          {/* ======================================================== */}
          <nav
            className="hidden lg:flex items-center space-x-7 xl:space-x-8"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[12px] uppercase font-semibold tracking-[0.16em] transition-colors relative py-1.5 flex items-center gap-1.5 focus:outline-none ${
                    active
                      ? "text-[#151515]"
                      : "text-[#151515]/75 hover:text-[#151515]"
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#151515] ${
                    active ? "after:scale-x-100" : "after:scale-x-0"
                  } hover:after:scale-x-100 after:transition-transform after:duration-200`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-[#D8FF36] text-[#151515] font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider rounded-[2px] shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ======================================================== */}
          {/* RIGHT SECTION — ACTION ICONS                             */}
          {/* Exact order: Search, Account, Shopping Bag / Cart        */}
          {/* ======================================================== */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* 1. Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#151515] hover:text-black transition-colors rounded-full hover:bg-[#E8E5DE]/60 focus:outline-none"
              aria-label="Search Catalog"
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* 2. Account */}
            <Link
              href={user ? "/account" : "/auth/login"}
              className="p-2 text-[#151515] hover:text-black transition-colors rounded-full hover:bg-[#E8E5DE]/60 focus:outline-none"
              aria-label={user ? `Account (${user.name})` : "Account Login"}
            >
              <User className="w-5 h-5" strokeWidth={1.75} />
            </Link>

            {/* 3. Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-[#151515] hover:text-black transition-colors rounded-full hover:bg-[#E8E5DE]/60 focus:outline-none"
              aria-label={`Shopping Bag (${totalItems} items)`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#151515] text-[#D8FF36] text-[10px] font-bold font-mono h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#151515] hover:text-black lg:hidden rounded-full hover:bg-[#E8E5DE]/60 focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EXPANDABLE MINIMAL SEARCH BAR                            */}
        {/* ======================================================== */}
        {searchOpen && (
          <div className="border-t border-[#E8E5DE] bg-[#F5F3EE] px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]"
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search heavyweight tees, oversized cuts, graphic tees, prints..."
                  autoFocus
                  className="w-full bg-[#E8E5DE] border border-[#D4D0C8] pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-[#151515] placeholder:text-[#777777] focus:outline-none focus:border-[#151515] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-[#151515] text-[#F5F3EE] hover:text-[#D8FF36] px-4 sm:px-6 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#777777] hover:text-[#151515] transition-colors shrink-0"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <div className="relative w-full max-w-xs bg-[#F5F3EE] h-full shadow-2xl flex flex-col justify-between p-6 z-10 border-r border-[#E8E5DE]">
            <div>
              {/* Header with Monogram and Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E8E5DE]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[2px] bg-[#151515] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 9H23.5C27.0899 9 30 11.9101 30 15.5C30 17.8546 28.7497 19.9174 26.8837 21.0506C29.3496 22.148 31 24.6226 31 27.5C31 31.6421 27.6421 35 23.5 35H11V9ZM17 14.5V19.5H23C24.3807 19.5 25.5 18.3807 25.5 17C25.5 15.6193 24.3807 14.5 23 14.5H17ZM17 24.5V29.5H23.5C24.8807 29.5 26 28.3807 26 27C26 25.6193 24.8807 24.5 23.5 24.5H17Z"
                        fill="#F5F3EE"
                      />
                      <rect x="33" y="9" width="4" height="4" fill="#D8FF36" />
                    </svg>
                  </div>
                  <span className="font-display text-2xl font-black tracking-wider text-[#151515] uppercase">
                    BUILD CLOTHING
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#151515] hover:text-black rounded-full hover:bg-[#E8E5DE]/60 transition-colors"
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
                      className={`text-sm uppercase font-bold tracking-wider py-3 px-2 rounded-sm transition-colors flex items-center justify-between ${
                        active
                          ? "bg-[#E8E5DE] text-[#151515]"
                          : "text-[#151515]/80 hover:text-[#151515] hover:bg-[#E8E5DE]/40"
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
            <div className="pt-6 border-t border-[#E8E5DE] space-y-3">
              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-3 bg-[#151515] text-[#F5F3EE] hover:text-[#D8FF36] font-bold text-xs uppercase tracking-widest transition-colors"
              >
                {user ? "My Account" : "Sign In / Join"}
              </Link>
              {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-2.5 bg-[#E8E5DE] text-[#151515] font-bold text-xs uppercase tracking-wider hover:bg-[#D4D0C8] transition-colors"
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
