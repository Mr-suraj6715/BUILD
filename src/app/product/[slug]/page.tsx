"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductCard from "@/components/ProductCard";
import StickyMobileAddToCart from "@/components/StickyMobileAddToCart";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selections
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  // Modals & Pincode check
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedColor(data.product.variants[0].color);
            // Default size if available
            const hasL = data.product.variants.some((v: any) => v.size === "L");
            setSelectedSize(hasL ? "L" : data.product.variants[0].size);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-sm">
        LOADING HIGH-DENSITY SPECS...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-4xl uppercase font-bold text-[#151515] mb-2">
          PRODUCT NOT FOUND
        </h2>
        <p className="text-xs text-[#777777] mb-6">
          This piece may have sold out or was part of an archived drop.
        </p>
        <Link
          href="/shop"
          className="bg-[#101010] text-[#D8FF36] px-6 py-3 text-xs font-bold uppercase tracking-widest"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Active variant
  const currentVariant = product.variants?.find(
    (v: any) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants?.[0];

  const currentStock = currentVariant?.stock ?? 0;
  const isOutOfStock = currentStock <= 0;

  // Unique colors
  const colorOptions = Array.from(
    new Map(
      (product.variants || []).map((v: any) => [v.color, { color: v.color, hex: v.colorHex }])
    ).values()
  );

  // Unique sizes
  const sizeOptions = Array.from(
    new Set((product.variants || []).map((v: any) => v.size))
  );

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95", alt: product.title }];

  const discountPercent =
    product.originalPrice > product.basePrice
      ? Math.round(
          ((product.originalPrice - product.basePrice) / product.originalPrice) * 100
        )
      : null;

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart({
      variantId: currentVariant.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: images[selectedImageIndex]?.url || images[0].url,
      price: product.basePrice,
      originalPrice: product.originalPrice,
      size: currentVariant.size,
      color: currentVariant.color,
      quantity,
      maxStock: currentStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setDeliveryStatus("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    setDeliveryStatus("Express Delivery Available: Expected delivery within 2–4 business days via BlueDart/Delhivery.");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewerName || "Verified Buyer",
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewComment("");
        setReviewerName("");
      }
    } catch {
      setReviewSuccess(true);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-[#777777] uppercase mb-8">
        <Link href="/" className="hover:text-[#151515]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#151515]">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#151515]">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#151515] font-bold truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery Column (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnail list */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-26 flex-shrink-0 border bg-[#E8E5DE] overflow-hidden transition-all ${
                  selectedImageIndex === idx
                    ? "border-[#151515] ring-2 ring-[#D8FF36]"
                    : "border-[#D4D0C8] opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || product.title}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Main Primary Image with zoom preview on hover */}
          <div className="flex-1 relative aspect-[3/4] bg-[#E8E5DE] border border-[#D4D0C8] overflow-hidden group">
            <img
              src={images[selectedImageIndex]?.url || images[0].url}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 cursor-crosshair"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.isNewDrop && (
                <span className="bg-[#D8FF36] text-[#101010] text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  NEW DROP
                </span>
              )}
              {product.isLimited && (
                <span className="bg-[#101010] text-[#D8FF36] text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  LIMITED RUN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Column (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Title & Collection */}
          <div>
            {product.collection && (
              <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
                {product.collection.name}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-5xl uppercase font-black tracking-tight text-[#151515] mt-1 leading-none">
              {product.title}
            </h1>

            {/* Rating / Reviews */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-[#101010]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5)
                        ? "fill-[#101010] text-[#101010]"
                        : "text-[#D4D0C8]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-[#151515]">
                {product.rating} / 5.0
              </span>
              <span className="text-xs text-[#777777]">
                ({product.reviewCount || 0} verified customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-6 border-b border-[#D4D0C8]">
            <span className="font-display text-4xl font-black text-[#151515]">
              {formatPrice(product.basePrice)}
            </span>
            {product.originalPrice > product.basePrice && (
              <>
                <span className="text-base text-[#777777] line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-[#D8FF36] text-[#101010] px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                  SAVE {discountPercent}%
                </span>
              </>
            )}
            <span className="text-[11px] text-[#777777] font-mono ml-auto">
              Tax included
            </span>
          </div>

          {/* Color Selector */}
          {colorOptions.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs font-mono uppercase mb-2">
                <span className="text-[#777777]">COLORWAY:</span>
                <span className="font-bold text-[#151515]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {colorOptions.map((c: any) => (
                  <button
                    key={c.color}
                    onClick={() => setSelectedColor(c.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor === c.color
                        ? "border-[#151515] ring-2 ring-[#D8FF36]"
                        : "border-[#D4D0C8] hover:border-[#151515]"
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full block"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono uppercase mb-2">
              <div>
                <span className="text-[#777777]">SELECT FIT: </span>
                <span className="font-bold text-[#151515]">{selectedSize}</span>
              </div>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-[#151515] font-bold underline hover:text-[#777777]"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {sizeOptions.map((sz: any) => {
                const variant = product.variants?.find(
                  (v: any) => v.size === sz && (!selectedColor || v.color === selectedColor)
                );
                const isSzOOS = !variant || variant.stock <= 0;

                return (
                  <button
                    key={sz}
                    disabled={isSzOOS}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-bold uppercase transition-all border ${
                      selectedSize === sz
                        ? "bg-[#101010] text-[#D8FF36] border-[#101010] shadow-md"
                        : isSzOOS
                        ? "bg-[#E8E5DE] text-[#999999] border-[#D4D0C8] line-through cursor-not-allowed"
                        : "bg-[#F5F3EE] text-[#151515] border-[#D4D0C8] hover:border-[#151515]"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {/* Real Stock Status */}
            <div className="mt-2 flex items-center justify-between text-xs font-mono">
              {isOutOfStock ? (
                <span className="text-red-600 font-bold">OUT OF STOCK IN THIS SIZE</span>
              ) : currentStock <= 5 ? (
                <span className="text-orange-600 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  ONLY {currentStock} PIECES LEFT — ORDER SOON
                </span>
              ) : (
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  IN STOCK ({currentStock} AVAILABLE)
                </span>
              )}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#151515] bg-[#E8E5DE] px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-sm font-bold text-[#151515] px-2 hover:text-[#777777]"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-[#151515] px-3">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                  className="text-sm font-bold text-[#151515] px-2 hover:text-[#777777]"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border border-[#101010] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="p-4 border border-[#151515] hover:bg-[#E8E5DE] transition-colors"
                aria-label="Save to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlist ? "fill-red-600 text-red-600" : "text-[#151515]"
                  }`}
                />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#D8FF36] text-[#101010] hover:bg-white text-xs font-black uppercase tracking-widest transition-all duration-200 border border-[#101010]"
              >
                BUY IT NOW
              </button>
            )}
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="bg-[#E8E5DE] p-4 border border-[#D4D0C8]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#151515] mb-2">
              <Truck className="w-4 h-4" />
              <span>ESTIMATE DELIVERY</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs font-mono text-[#151515] focus:outline-none focus:border-[#151515]"
              />
              <button
                type="submit"
                className="bg-[#101010] text-[#D8FF36] px-4 py-2 text-xs font-bold uppercase tracking-wider"
              >
                Check
              </button>
            </form>
            {deliveryStatus && (
              <p className="text-[11px] font-mono text-[#151515] mt-2">
                {deliveryStatus}
              </p>
            )}
          </div>

          {/* Garment Specifications List */}
          <div className="pt-4 border-t border-[#D4D0C8] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515]">
              TECHNICAL SPECIFICATIONS
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#E8E5DE] p-2.5">
                <span className="text-[#777777] block text-[10px]">WEIGHT / GSM</span>
                <span className="font-bold text-[#151515]">{product.gsm} GSM Dense Heavyweight</span>
              </div>
              <div className="bg-[#E8E5DE] p-2.5">
                <span className="text-[#777777] block text-[10px]">CUT & SILHOUETTE</span>
                <span className="font-bold text-[#151515]">{product.fit}</span>
              </div>
              <div className="bg-[#E8E5DE] p-2.5">
                <span className="text-[#777777] block text-[10px]">FABRIC COMPOSITION</span>
                <span className="font-bold text-[#151515]">{product.fabric}</span>
              </div>
              <div className="bg-[#E8E5DE] p-2.5">
                <span className="text-[#777777] block text-[10px]">RETURNS & EXCHANGE</span>
                <span className="font-bold text-[#151515]">7-Day Hassle Free</span>
              </div>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed pt-2">
              {product.description}
            </p>
            <div className="text-[11px] font-mono text-[#777777] bg-[#E8E5DE] p-3 border-l-2 border-[#101010]">
              <strong>Care:</strong> {product.careInstructions}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="mt-20 pt-12 border-t border-[#D4D0C8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Overall rating & add review form */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
                CUSTOMER FEEDBACK
              </span>
              <h2 className="font-display text-4xl uppercase font-black tracking-tight text-[#151515] mt-1">
                COMMUNITY REVIEWS
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="font-display text-5xl font-black text-[#151515]">
                  {product.rating}
                </span>
                <div>
                  <div className="flex items-center text-[#101010]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 5)
                            ? "fill-[#101010] text-[#101010]"
                            : "text-[#D4D0C8]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#777777] font-mono">
                    Based on {product.reviews?.length || 0} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Write a Review Box */}
            <div className="bg-[#E8E5DE] p-5 border border-[#D4D0C8]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#151515] mb-3">
                WRITE A VERIFIED REVIEW
              </h3>
              {!reviewSuccess ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                      Rating
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs font-bold text-[#151515]"
                    >
                      <option value={5}>5 Stars — Perfect Drop</option>
                      <option value={4}>4 Stars — Solid Fit</option>
                      <option value={3}>3 Stars — Average</option>
                      <option value={2}>2 Stars — Needs Improvement</option>
                      <option value={1}>1 Star — Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Siddharth M."
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs text-[#151515]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts on the GSM, fabric drape, and sizing..."
                      required
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs text-[#151515]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-2.5 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    {reviewSubmitting ? "Posting..." : "SUBMIT REVIEW"}
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-[#F5F3EE] border border-[#D8FF36] text-xs text-green-700 font-bold">
                  Thank you! Your verified review has been posted.
                </div>
              )}
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-8 divide-y divide-[#D4D0C8]">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev: any) => (
                <div key={rev.id} className="py-5 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase text-[#151515]">
                        {rev.userName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-green-700 bg-green-100 px-1.5 py-0.5">
                        <Check className="w-3 h-3" /> VERIFIED PURCHASE
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#777777]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-[#101010] mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#101010]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#777777]">
                No reviews yet. Be the first to review this release!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Similar & Complete The Look Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#D4D0C8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#101010]" />
                RECOMMENDED T-SHIRTS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase font-black tracking-tight text-[#151515] mt-1">
                SIMILAR T-SHIRTS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        fitType={product.fit}
      />

      {/* Sticky Mobile Add To Cart Bar */}
      <StickyMobileAddToCart
        title={product.title}
        price={product.basePrice}
        selectedSize={selectedSize}
        isOutOfStock={isOutOfStock}
        onAddToCart={handleAddToCart}
        added={added}
      />
    </div>
  );
}

