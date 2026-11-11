"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Search,
  Check,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialCategory = searchParams.get("category") || "";
  const initialCollection = searchParams.get("collection") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialSize = searchParams.get("size") || "";
  const initialBadge = searchParams.get("badge") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedBadge, setSelectedBadge] = useState(initialBadge);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL searchParams change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedCollection(searchParams.get("collection") || "");
    setSelectedSort(searchParams.get("sort") || "newest");
    setSelectedSize(searchParams.get("size") || "");
    setSelectedBadge(searchParams.get("badge") || "");
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCollection) params.set("collection", selectedCollection);
    if (selectedSort) params.set("sort", selectedSort);
    if (selectedSize) params.set("size", selectedSize);
    if (selectedBadge) params.set("badge", selectedBadge);
    if (searchTerm) params.set("search", searchTerm);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);
        if (data.categories) setCategories(data.categories);
        if (data.collections) setCollections(data.collections);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedCollection, selectedSort, selectedSize, selectedBadge, searchTerm]);

  const updateFilters = (newFilters: {
    category?: string;
    collection?: string;
    sort?: string;
    size?: string;
    badge?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }
    });

    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedCollection("");
    setSelectedSize("");
    setSelectedBadge("");
    setSearchTerm("");
    setSelectedSort("newest");
    router.push("/shop");
  };

  const activeFilterCount = [
    selectedCategory,
    selectedCollection,
    selectedSize,
    selectedBadge,
    searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-screen">
      {/* Catalog Header */}
      <div className="border-b border-[#D4D0C8] pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
              EXCLUSIVE T-SHIRT ARCHIVE
            </span>
            <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515]">
              STREETWEAR T-SHIRT CATALOG
            </h1>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateFilters({ search: e.target.value });
                }}
                placeholder="Search styles..."
                className="bg-[#E8E5DE] border border-[#D4D0C8] px-3.5 py-2 pl-9 text-xs font-medium text-[#151515] placeholder:text-[#777777] focus:outline-none focus:border-[#151515] w-48 sm:w-60"
              />
              <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  updateFilters({ sort: e.target.value });
                }}
                className="bg-[#E8E5DE] border border-[#D4D0C8] px-3 py-2 pr-8 text-xs font-bold uppercase tracking-wider text-[#151515] focus:outline-none focus:border-[#151515] cursor-pointer appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Popularity</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#151515] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-[#101010] text-[#D8FF36] px-3.5 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#E8E5DE]">
            <span className="text-xs font-mono uppercase text-[#777777] mr-2">
              Active Filters:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#101010] text-[#D8FF36] text-xs uppercase font-mono">
                Category: {selectedCategory}
                <button onClick={() => updateFilters({ category: "" })}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#101010] text-[#D8FF36] text-xs uppercase font-mono">
                Collection: {selectedCollection}
                <button onClick={() => updateFilters({ collection: "" })}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#101010] text-[#D8FF36] text-xs uppercase font-mono">
                Size: {selectedSize}
                <button onClick={() => updateFilters({ size: "" })}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}
            {selectedBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#101010] text-[#D8FF36] text-xs uppercase font-mono">
                Badge: {selectedBadge}
                <button onClick={() => updateFilters({ badge: "" })}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#101010] text-[#D8FF36] text-xs uppercase font-mono">
                Query: &quot;{searchTerm}&quot;
                <button onClick={() => updateFilters({ search: "" })}>
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold uppercase tracking-wider text-red-600 hover:underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block col-span-1 space-y-8 pr-4 border-r border-[#E8E5DE]">
          {/* Quick Badges */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
              DROP TYPE
            </h3>
            <div className="flex flex-col space-y-2">
              {[
                { label: "All Items", val: "" },
                { label: "New Drops", val: "NEW DROP" },
                { label: "Bestsellers", val: "bestseller" },
                { label: "Limited Runs", val: "limited" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => {
                    setSelectedBadge(b.val);
                    updateFilters({ badge: b.val });
                  }}
                  className={`text-left text-xs font-bold uppercase tracking-wider py-1.5 px-2 transition-colors flex items-center justify-between ${
                    selectedBadge === b.val
                      ? "bg-[#101010] text-[#D8FF36]"
                      : "text-[#555555] hover:text-[#151515] hover:bg-[#E8E5DE]"
                  }`}
                >
                  <span>{b.label}</span>
                  {selectedBadge === b.val && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
              CATEGORIES
            </h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  updateFilters({ category: "" });
                }}
                className={`text-left text-xs font-semibold uppercase tracking-wider py-1 transition-colors ${
                  !selectedCategory ? "text-[#101010] font-black underline" : "text-[#777777] hover:text-[#151515]"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    updateFilters({ category: cat.slug });
                  }}
                  className={`text-left text-xs font-semibold uppercase tracking-wider py-1 transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? "text-[#101010] font-black underline"
                      : "text-[#777777] hover:text-[#151515]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-mono text-[#999999]">({cat._count?.products || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
              COLLECTIONS
            </h3>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  setSelectedCollection("");
                  updateFilters({ collection: "" });
                }}
                className={`text-left text-xs font-semibold uppercase tracking-wider py-1 transition-colors ${
                  !selectedCollection ? "text-[#101010] font-black underline" : "text-[#777777] hover:text-[#151515]"
                }`}
              >
                All Collections
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedCollection(col.slug);
                    updateFilters({ collection: col.slug });
                  }}
                  className={`text-left text-xs font-semibold uppercase tracking-wider py-1 transition-colors flex items-center justify-between ${
                    selectedCollection === col.slug
                      ? "text-[#101010] font-black underline"
                      : "text-[#777777] hover:text-[#151515]"
                  }`}
                >
                  <span>{col.name}</span>
                  <span className="text-[10px] font-mono text-[#999999]">({col._count?.products || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
              SIZE (OVERSIZED)
            </h3>
            <div className="grid grid-cols-5 gap-1.5">
              {["S", "M", "L", "XL", "XXL"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    const newSz = selectedSize === sz ? "" : sz;
                    setSelectedSize(newSz);
                    updateFilters({ size: newSz });
                  }}
                  className={`h-9 text-xs font-bold flex items-center justify-center border transition-colors ${
                    selectedSize === sz
                      ? "bg-[#101010] text-[#D8FF36] border-[#101010]"
                      : "bg-[#E8E5DE] text-[#151515] border-[#D4D0C8] hover:border-[#151515]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-span-1 md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse space-y-3">
                  <div className="aspect-[3/4] bg-[#E8E5DE]" />
                  <div className="h-4 bg-[#E8E5DE] w-3/4" />
                  <div className="h-3 bg-[#E8E5DE] w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-[#E8E5DE] border border-[#D4D0C8] p-8">
              <h3 className="font-display text-3xl uppercase font-bold text-[#151515] mb-2">
                NO PIECES MATCH YOUR CRITERIA
              </h3>
              <p className="text-xs text-[#777777] mb-6 max-w-sm mx-auto">
                Try loosening your filters or resetting your search to explore our full collection archive.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#101010] text-[#D8FF36] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs font-mono text-[#777777] uppercase">
                SHOWING {products.length} OF {totalCount} RELEASES
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#F5F3EE] h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D4D0C8]">
                <h3 className="font-display text-2xl uppercase font-bold text-[#151515]">
                  FILTERS
                </h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-6 h-6 text-[#151515]" />
                </button>
              </div>

              {/* Badges */}
              <div className="py-4 border-b border-[#E8E5DE]">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
                  DROP TYPE
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All Items", val: "" },
                    { label: "New Drops", val: "NEW DROP" },
                    { label: "Bestsellers", val: "bestseller" },
                    { label: "Limited", val: "limited" },
                  ].map((b) => (
                    <button
                      key={b.label}
                      onClick={() => {
                        setSelectedBadge(b.val);
                        updateFilters({ badge: b.val });
                      }}
                      className={`px-3 py-1.5 text-xs font-bold uppercase ${
                        selectedBadge === b.val
                          ? "bg-[#101010] text-[#D8FF36]"
                          : "bg-[#E8E5DE] text-[#151515]"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="py-4 border-b border-[#E8E5DE]">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
                  SIZES
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        const newSz = selectedSize === sz ? "" : sz;
                        setSelectedSize(newSz);
                        updateFilters({ size: newSz });
                      }}
                      className={`h-9 text-xs font-bold flex items-center justify-center border ${
                        selectedSize === sz
                          ? "bg-[#101010] text-[#D8FF36] border-[#101010]"
                          : "bg-[#E8E5DE] text-[#151515] border-[#D4D0C8]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D4D0C8] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-widest"
              >
                APPLY & CLOSE ({totalCount})
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-xs font-bold uppercase tracking-wider text-red-600"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center font-mono">LOADING CATALOG...</div>}>
      <ShopContent />
    </Suspense>
  );
}

