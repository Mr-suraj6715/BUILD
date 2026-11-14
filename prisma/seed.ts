import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BUILD CLOTHING database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.marqueeMessage.deleteMany();
  await prisma.dropCountdown.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const customerPassword = await bcrypt.hash("Customer@123456", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@buildclothing.com",
      passwordHash: adminPassword,
      name: "BUILD Admin",
      role: "ADMIN",
      phone: "+91 9876543210",
      addresses: {
        create: {
          fullName: "BUILD Flagship Store",
          phone: "+91 9876543210",
          addressLine1: "104, Fashion Avenue, Bandra West",
          addressLine2: "Near Linking Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          country: "India",
          isDefault: true,
        },
      },
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@buildclothing.com",
      passwordHash: customerPassword,
      name: "Aarav Sharma",
      role: "CUSTOMER",
      phone: "+91 9123456789",
      addresses: {
        create: {
          fullName: "Aarav Sharma",
          phone: "+91 9123456789",
          addressLine1: "Flat 402, Skyline Residency",
          addressLine2: "Indiranagar 100ft Road",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
          country: "India",
          isDefault: true,
        },
      },
    },
  });

  // Announcements
  await prisma.announcement.createMany({
    data: [
      { text: "NEW DROP LIVE — LIMITED QUANTITIES WORLDWIDE", link: "/shop?badge=NEW DROP", priority: 1 },
      { text: "FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹1,499", link: "/shop", priority: 2 },
      { text: "USE CODE 'BUILD10' FOR 10% OFF YOUR FIRST ORDER", link: "/shop", priority: 3 },
    ],
  });

  // Marquee
  await prisma.marqueeMessage.createMany({
    data: [
      { text: "BUILT DIFFERENT • WEAR YOUR IDENTITY • NO ORDINARY FITS • BUILD CLOTHING • EXCLUSIVE RUNS ONLY • 240+ GSM HEAVYWEIGHT COTTON •" },
    ],
  });

  // Drop Countdown
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);
  futureDate.setHours(18, 0, 0, 0);

  await prisma.dropCountdown.create({
    data: {
      title: "DROP 009: CYBER ARCHIVE",
      subtitle: "STRICTLY LIMITED TO 300 NUMBERED PIECES",
      description: "Experimental boxy silhouettes crafted with 260 GSM Japanese combed cotton, industrial high-density rubberized typography, and custom distressed wash.",
      targetDate: futureDate,
      imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2400&q=95",
      badge: "EXCLUSIVE DROP",
      isActive: true,
    },
  });

  // Categories - STRICTLY T-SHIRTS ONLY
  const catAll = await prisma.category.create({
    data: {
      name: "ALL T-SHIRTS",
      slug: "all-t-shirts",
      description: "The complete archive of heavyweight, graphic, minimal, and oversized streetwear tees.",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95",
    },
  });

  const catOversized = await prisma.category.create({
    data: {
      name: "OVERSIZED T-SHIRTS",
      slug: "oversized-t-shirts",
      description: "Heavyweight drop-shoulder graphic tees crafted for the perfect Gen Z boxy drape.",
      image: "/images/stitch/collection-oversized.jpg",
    },
  });

  const catGraphic = await prisma.category.create({
    data: {
      name: "GRAPHIC T-SHIRTS",
      slug: "graphic-t-shirts",
      description: "High-density silkscreen, cyberpunk, anime, and distorted typography hits.",
      image: "/images/stitch/collection-graphic.jpg",
    },
  });

  const catCustom = await prisma.category.create({
    data: {
      name: "CUSTOM PRINTED T-SHIRTS",
      slug: "custom-printed-t-shirts",
      description: "Design your own custom oversized tee blanks with 1200 DPI Kornit print labs.",
      image: "/images/stitch/custom-mockup.png",
    },
  });

  const catMinimal = await prisma.category.create({
    data: {
      name: "MINIMAL T-SHIRTS",
      slug: "minimal-t-shirts",
      description: "Understated luxury, subtle tonal chest typography, and clean boxy silhouettes.",
      image: "/images/stitch/collection-original.jpg",
    },
  });

  const catLimited = await prisma.category.create({
    data: {
      name: "LIMITED EDITION T-SHIRTS",
      slug: "limited-edition-t-shirts",
      description: "Numbered capsules and archive drops strictly limited to single runs.",
      image: "/images/stitch/collection-drops.jpg",
    },
  });

  // Collections
  const colOversizedEdit = await prisma.collection.create({
    data: {
      name: "THE OVERSIZED EDIT",
      slug: "oversized-edit",
      description: "Engineered boxy silhouettes featuring custom drop shoulders and reinforced collars.",
      image: "/images/stitch/collection-oversized.jpg",
      isFeatured: true,
      badge: "CORE SILHOUETTE",
    },
  });

  const colGraphicUniverse = await prisma.collection.create({
    data: {
      name: "GRAPHIC UNIVERSE",
      slug: "graphic-universe",
      description: "Subversive graphics, cyber-nihilism, and distorted Japanese typography hits.",
      image: "/images/stitch/collection-graphic.jpg",
      isFeatured: true,
      badge: "HIGH IMPACT",
    },
  });

  const colEssentials = await prisma.collection.create({
    data: {
      name: "ORIGINAL ARTWORK",
      slug: "original-artwork",
      description: "Numbered capsules designed in conjunction with global underground digital artists.",
      image: "/images/stitch/collection-original.jpg",
      isFeatured: true,
      badge: "COLLABORATIVE",
    },
  });

  const colLimitedDrops = await prisma.collection.create({
    data: {
      name: "LIMITED DROPS",
      slug: "limited-drops",
      description: "One-off runs, never restocked. Every unit stamped with a unique cryptographic verification serial.",
      image: "/images/stitch/collection-drops.jpg",
      isFeatured: true,
      badge: "ARCHIVE ONLY",
    },
  });

  // Products Data
  const products = [
    {
      title: "ABSTRACT VISION OVERSIZED TEE",
      slug: "abstract-vision-oversized-tee",
      description: "Engineered in Tokyo from ultra-dense 280 GSM luxury combed organic cotton. Features high-density brutalist vector art on the front chest and massive full-back cyberpunk blueprint print with lower hem woven label tag.",
      fabric: "100% Combed Organic Cotton (280 GSM)",
      gsm: 280,
      fit: "Tokyo Boxy Fit",
      basePrice: 1999,
      originalPrice: 2499,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: true,
      isLimited: false,
      rating: 4.9,
      reviewCount: 42,
      categoryId: catOversized.id,
      collectionId: colOversizedEdit.id,
      images: [
        { url: "/images/stitch/product-1-front.jpg", alt: "Abstract Vision Front", isPrimary: true },
        { url: "/images/stitch/product-1-back.jpg", alt: "Abstract Vision Back Print", isPrimary: false },
      ],
      colors: [
        { name: "Washed Charcoal", hex: "#242424" },
        { name: "Bone White", hex: "#E4E2DD" },
        { name: "Washed Olive", hex: "#383A2D" },
      ],
    },
    {
      title: "MIDNIGHT GRAPHIC TEE",
      slug: "midnight-graphic-tee",
      description: "Deep onyx black 280 GSM heavyweight cotton blank with high-density cyber-punk graphic print across front chest and tactile 3D textured ink finish across the back shoulders.",
      fabric: "100% Combed Ringspun Cotton (280 GSM)",
      gsm: 280,
      fit: "Drop-Shoulder Boxy Cut",
      basePrice: 2199,
      originalPrice: 2799,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: true,
      isLimited: true,
      rating: 4.8,
      reviewCount: 31,
      categoryId: catOversized.id,
      collectionId: colGraphicUniverse.id,
      images: [
        { url: "/images/stitch/product-2-front.jpg", alt: "Midnight Graphic Front", isPrimary: true },
        { url: "/images/stitch/product-2-back.jpg", alt: "Midnight Graphic Back", isPrimary: false },
      ],
      colors: [
        { name: "Onyx Black", hex: "#111111" },
        { name: "Concrete Grey", hex: "#696B6B" },
      ],
    },
    {
      title: "STREET CULTURE TEE",
      slug: "street-culture-tee",
      description: "Pristine bone white streetwear tee in 280 GSM raw combed yarn. Features chest typography emblem and high-contrast geometric blueprint architectural layout on the back.",
      fabric: "100% Heavyweight Cotton (280 GSM)",
      gsm: 280,
      fit: "Standard Streetwear Cut",
      basePrice: 1899,
      originalPrice: 2399,
      isFeatured: true,
      isBestseller: false,
      isNewDrop: true,
      isLimited: false,
      rating: 4.9,
      reviewCount: 27,
      categoryId: catOversized.id,
      collectionId: colEssentials.id,
      images: [
        { url: "/images/stitch/product-3-front.jpg", alt: "Street Culture Front", isPrimary: true },
        { url: "/images/stitch/product-3-back.jpg", alt: "Street Culture Back", isPrimary: false },
      ],
      colors: [
        { name: "Off-White Bone", hex: "#E8E6DF" },
        { name: "Sand", hex: "#D5CBBA" },
      ],
    },
    {
      title: "ELECTRIC DREAMS TEE",
      slug: "electric-dreams-tee",
      description: "Acid-washed slate grey luxury blank featuring vivid high-voltage toxic lime typography hit across chest and abstract glitch graphic across shoulders.",
      fabric: "100% Acid Washed Cotton (280 GSM)",
      gsm: 280,
      fit: "Relaxed Boxy Fit",
      basePrice: 2299,
      originalPrice: 2699,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: false,
      isLimited: true,
      rating: 5.0,
      reviewCount: 18,
      categoryId: catOversized.id,
      collectionId: colLimitedDrops.id,
      images: [
        { url: "/images/stitch/product-4-front.jpg", alt: "Electric Dreams Front", isPrimary: true },
        { url: "/images/stitch/product-4-back.jpg", alt: "Electric Dreams Back", isPrimary: false },
      ],
      colors: [
        { name: "Acid Slate", hex: "#4D5359" },
        { name: "Toxic Lime", hex: "#C9EF22" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      title: "NEO TOKYO RECON OVERSIZED TEE",
      slug: "neo-tokyo-recon-oversized-tee",
      description: "The crown jewel of our Cyber Series. Built from ultra-dense 240 GSM combed ringspun cotton with our signature exaggerated boxy cut. High-definition screenprint features dystopian mecha schematics with acid-resistant inks. Pre-shrunk with enzyme wash for an unmatched vintage drape.",
      fabric: "100% Combed Ringspun Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      basePrice: 1499,
      originalPrice: 2499,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: true,
      isLimited: false,
      rating: 4.9,
      reviewCount: 38,
      categoryId: catOversized.id,
      collectionId: colGraphicUniverse.id,
      images: [
        { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95", alt: "Neo Tokyo Front Angle", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2400&q=95", alt: "Neo Tokyo Detail Print", isPrimary: false },
        { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=2400&q=95", alt: "Neo Tokyo Model Look", isPrimary: false },
      ],
      colors: [
        { name: "Washed Black", hex: "#151515" },
        { name: "Vintage Bone", hex: "#E8E5DE" },
      ],
    },
    {
      title: "DYSTOPIAN ARCHITECT HEAVY TEE",
      slug: "dystopian-architect-heavy-tee",
      description: "Inspired by brutalist architectural blueprints and industrial decay. Crafted from 260 GSM custom-milled heavyweight jersey with reinforced twin-needle stitching and an ultra-thick 1.25-inch rib neck.",
      fabric: "100% Ultra-Heavy Jersey (260 GSM)",
      gsm: 260,
      fit: "Wide Boxy Street Cut",
      basePrice: 1699,
      originalPrice: 2699,
      isFeatured: true,
      isBestseller: false,
      isNewDrop: true,
      isLimited: true,
      rating: 4.8,
      reviewCount: 19,
      categoryId: catOversized.id,
      collectionId: colOversizedEdit.id,
      images: [
        { url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2400&q=95", alt: "Dystopian Architect Tee", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=2400&q=95", alt: "Back Typography Angle", isPrimary: false },
      ],
      colors: [
        { name: "Acid Charcoal", hex: "#222222" },
        { name: "Military Olive", hex: "#3D4438" },
      ],
    },
    {
      title: "KAIJU PROTOCOL 280 GSM OVERSIZED TEE",
      slug: "kaiju-protocol-280-gsm-oversized-tee",
      description: "Our signature heavyweight drop-shoulder silhouette. 280 GSM luxury combed organic cotton with massive biomechanical cyber kaiju screenprint on the back and reflective accent hits.",
      fabric: "100% Combed Ringspun Cotton (280 GSM)",
      gsm: 280,
      fit: "Tokyo Boxy Drop",
      basePrice: 1999,
      originalPrice: 2799,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: false,
      isLimited: true,
      rating: 5.0,
      reviewCount: 52,
      categoryId: catLimited.id,
      collectionId: colLimitedDrops.id,
      images: [
        { url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2400&q=95", alt: "Kaiju Protocol Tee Front", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2400&q=95", alt: "Kaiju Protocol Tee Back", isPrimary: false },
      ],
      colors: [
        { name: "Pitch Black", hex: "#101010" },
        { name: "Raw Off-White", hex: "#F5F3EE" },
      ],
    },
    {
      title: "CHROMATIC CHAOS ACID OVERSIZED TEE",
      slug: "chromatic-chaos-acid-oversized-tee",
      description: "Bold digital distortion print on washed mineral fabric. Featuring contrasting Electric Lime accents that pop in daylight and UV light. Engineered for statement styling.",
      fabric: "100% Combed Ringspun Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      basePrice: 1599,
      originalPrice: 2299,
      isFeatured: true,
      isBestseller: false,
      isNewDrop: true,
      isLimited: false,
      rating: 4.7,
      reviewCount: 14,
      categoryId: catGraphic.id,
      collectionId: colGraphicUniverse.id,
      images: [
        { url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=2400&q=95", alt: "Chromatic Chaos Tee", isPrimary: true },
      ],
      colors: [
        { name: "Moss Green", hex: "#2E3A2F" },
        { name: "Pitch Black", hex: "#151515" },
      ],
    },
    {
      title: "VOID MATRIX MINIMALIST BOX TEE",
      slug: "void-matrix-minimalist-box-tee",
      description: "Understated luxury for the minimalist. Monochromatic high-density 3D rubber chest logo with clean dropped shoulders. The daily uniform for the modern creator.",
      fabric: "100% Combed Organic Cotton (250 GSM)",
      gsm: 250,
      fit: "Wide Box Cut",
      basePrice: 1399,
      originalPrice: 1999,
      isFeatured: false,
      isBestseller: true,
      isNewDrop: false,
      isLimited: false,
      rating: 4.9,
      reviewCount: 46,
      categoryId: catMinimal.id,
      collectionId: colEssentials.id,
      images: [
        { url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=95", alt: "Void Matrix Tee", isPrimary: true },
      ],
      colors: [
        { name: "Mineral Slate", hex: "#3A3D40" },
        { name: "Bone White", hex: "#E8E5DE" },
      ],
    },
    {
      title: "CYBER RONIN ANIME GRAPHIC TEE",
      slug: "cyber-ronin-anime-graphic-tee",
      description: "Exquisite drop-shoulder construction. High-density cyberpunk katana anime artwork across rear panel with distressed water-based chest typography.",
      fabric: "100% Combed Ringspun Cotton (260 GSM)",
      gsm: 260,
      fit: "Sculpted Boxy Drop",
      basePrice: 1899,
      originalPrice: 2599,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: false,
      isLimited: true,
      rating: 5.0,
      reviewCount: 67,
      categoryId: catGraphic.id,
      collectionId: colLimitedDrops.id,
      images: [
        { url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=2400&q=95", alt: "Cyber Ronin Tee", isPrimary: true },
      ],
      colors: [
        { name: "Jet Black", hex: "#0E0E0E" },
      ],
    },
    {
      title: "NO SIGNAL RETRO GLITCH TEE",
      slug: "no-signal-retro-glitch-tee",
      description: "Vintage cathode ray tube raster graphics with a distressed water-based screenprint. Soft-hand finish that becomes even more unique with each wash.",
      fabric: "100% Ringspun Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      basePrice: 1499,
      originalPrice: 2199,
      isFeatured: false,
      isBestseller: false,
      isNewDrop: true,
      isLimited: false,
      rating: 4.6,
      reviewCount: 11,
      categoryId: catGraphic.id,
      collectionId: colGraphicUniverse.id,
      images: [
        { url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=2400&q=95", alt: "No Signal Retro Tee", isPrimary: true },
      ],
      colors: [
        { name: "Vintage Bone", hex: "#E8E5DE" },
        { name: "Washed Black", hex: "#151515" },
      ],
    },
    {
      title: "ASTRAL DRIFT MINIMAL TYPOGRAPHY TEE",
      slug: "astral-drift-minimal-typography-tee",
      description: "Thick neck ribbing with reverse flatlock stitching. Relaxed minimalist street fit with subtle tonal chest typography.",
      fabric: "100% Combed Jersey (240 GSM)",
      gsm: 240,
      fit: "Boxy Street Tee",
      basePrice: 1499,
      originalPrice: 1999,
      isFeatured: false,
      isBestseller: true,
      isNewDrop: false,
      isLimited: false,
      rating: 4.8,
      reviewCount: 29,
      categoryId: catMinimal.id,
      collectionId: colEssentials.id,
      images: [
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2400&q=95", alt: "Astral Drift Tee", isPrimary: true },
      ],
      colors: [
        { name: "Heather Slate", hex: "#5C6068" },
        { name: "Pitch Black", hex: "#101010" },
      ],
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        fabric: p.fabric,
        gsm: p.gsm,
        fit: p.fit,
        printType: "High-Density Screen Print",
        printPlacement: "Front & Back",
        artwork: `${p.title} Graphic`,
        basePrice: p.basePrice,
        originalPrice: p.originalPrice,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewDrop: p.isNewDrop,
        isLimited: p.isLimited,
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        images: {
          create: p.images.map((img, idx) => ({
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
            displayOrder: idx,
          })),
        },
      },
    });

    // Create variants: Sizes S, M, L, XL, XXL for each color
    const sizes = ["S", "M", "L", "XL", "XXL"];
    for (let cIdx = 0; cIdx < p.colors.length; cIdx++) {
      const color = p.colors[cIdx];
      for (const size of sizes) {
        const sku = `BLD-${createdProduct.slug.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()}-C${cIdx + 1}-${size}`;
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            size,
            color: color.name,
            colorHex: color.hex,
            sku,
            stock: size === "XL" ? 15 : size === "L" ? 22 : 12,
            additionalPrice: 0,
          },
        });
      }
    }

    // Add 2 reviews per product
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        userName: "Aarav Sharma",
        rating: 5,
        comment: "Insane GSM quality. The collar does not sag at all and the drop shoulder fits like a designer piece. Best streetwear cop of the year.",
      },
    });
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userName: "Rhea K.",
        rating: 5,
        comment: "Graphic is super crisp and doesn't crack after washing. Definitely sizing up for that ultra baggy Gen Z silhouette!",
      },
    });
  }

  // Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "BUILD10",
        discountPercent: 10,
        minOrderValue: 999,
        maxDiscount: 500,
        isActive: true,
      },
      {
        code: "GENZ15",
        discountPercent: 15,
        minOrderValue: 1999,
        maxDiscount: 800,
        isActive: true,
      },
      {
        code: "FREESHIP",
        discountAmount: 100,
        minOrderValue: 499,
        isActive: true,
      },
      {
        code: "SURAJ300",
        discountPercent: 50,
        minOrderValue: 499,
        maxDiscount: 1500,
        isActive: true,
      },
    ],
  });

  // Create a sample past order for customer
  const sampleOrderNumber = "BLD-2505-8821";
  const firstProduct = await prisma.product.findFirst({
    where: { slug: "neo-tokyo-recon-oversized-tee" },
    include: { variants: true },
  });

  if (firstProduct && firstProduct.variants.length > 0) {
    const v = firstProduct.variants[0];
    await prisma.order.create({
      data: {
        orderNumber: sampleOrderNumber,
        userId: customer.id,
        guestEmail: customer.email,
        guestPhone: customer.phone,
        status: "DELIVERED",
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        razorpayOrderId: "order_mock_sample_123",
        razorpayPaymentId: "pay_mock_sample_456",
        subtotal: firstProduct.basePrice,
        discount: 150,
        shippingFee: 0,
        totalAmount: firstProduct.basePrice - 150,
        shippingAddress: JSON.stringify({
          fullName: "Aarav Sharma",
          phone: "+91 9123456789",
          addressLine1: "Flat 402, Skyline Residency",
          addressLine2: "Indiranagar 100ft Road",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
          country: "India",
        }),
        trackingNumber: "DELHIVERY-998822110",
        courierName: "Delhivery Express",
        items: {
          create: {
            variantId: v.id,
            productTitle: firstProduct.title,
            variantSize: v.size,
            variantColor: v.color,
            unitPrice: firstProduct.basePrice,
            quantity: 1,
            total: firstProduct.basePrice,
            productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95",
          },
        },
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
