import { z } from "zod";

// Customer Authentication
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  phone: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Checkout & Address
export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  addressLine1: z.string().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit Indian PIN code"),
  country: z.string().default("India"),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().positive().max(10),
    })
  ).min(1, "Cart cannot be empty"),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  couponCode: z.string().optional().nullable(),
  guestEmail: z.string().email().optional().nullable(),
  guestPhone: z.string().optional().nullable(),
});

// Admin Product Validation
export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fabric: z.string().default("100% Combed Ringspun Cotton"),
  gsm: z.coerce.number().int().min(150).max(600).default(240),
  fit: z.string().default("Oversized Boxy Fit"),
  basePrice: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  collectionId: z.string().optional().nullable(),
  isNewDrop: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isLimited: z.boolean().default(false),
  imageUrl: z.string().url("Must be a valid image URL"),
  colorName: z.string().default("Pitch Black"),
  colorHex: z.string().default("#151515"),
  initialStock: z.coerce.number().int().min(0).default(20),
});

// Admin Coupon Validation
export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountPercent: z.coerce.number().min(1).max(90).optional().nullable(),
  discountAmount: z.coerce.number().positive().optional().nullable(),
  minOrderValue: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().positive().optional().nullable(),
});

// Review Validation
export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters").max(500),
  userName: z.string().min(2).max(50).optional(),
});

