import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Adding Official BUILD Series Products to Database ---');

  // Find or create "THE BUILD SERIES" collection
  let collection = await prisma.collection.findFirst({
    where: { slug: 'the-build-series' }
  });

  if (!collection) {
    collection = await prisma.collection.create({
      data: {
        name: 'THE BUILD SERIES',
        slug: 'the-build-series',
        description: 'Core 240 GSM heavyweight collection: Building A Better Tomorrow.',
        image: '/images/campaign/build-series-navy.jpg',
        badge: 'CORE COLLECTION',
        isFeatured: true,
      }
    });
    console.log('Created Collection: THE BUILD SERIES');
  } else {
    await prisma.collection.update({
      where: { id: collection.id },
      data: {
        image: '/images/campaign/build-series-navy.jpg',
        badge: 'CORE COLLECTION',
        isFeatured: true,
      }
    });
  }

  // Find "OVERSIZED T-SHIRTS" category
  let category = await prisma.category.findFirst({
    where: { slug: 'oversized-t-shirts' }
  });
  if (!category) {
    category = await prisma.category.findFirst();
  }

  const productsToAdd = [
    {
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (NAVY)",
      slug: "build-series-better-tomorrow-tee-navy",
      description: "The official BUILD flagship tee. Crafted from 240 GSM custom-milled heavyweight combed cotton with reinforced twin-needle stitching and an ultra-thick 1.25-inch rib neck. Features signature BUILD chest print and massive high-density 'Building A Better Tomorrow' architectural globe graphic on the rear panel.",
      fabric: "100% Premium Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      printType: "High-Density Screen Print",
      printPlacement: "Front Chest & Full Back Graphic",
      artwork: "Building A Better Tomorrow Official Graphic",
      basePrice: 1699,
      originalPrice: 2699,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: true,
      isLimited: true,
      rating: 5.0,
      reviewCount: 64,
      categoryId: category.id,
      collectionId: collection.id,
      images: [
        { url: "/images/products/build-series-navy-front.jpg", alt: "BUILD Series Navy Front View", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-series-navy-back.jpg", alt: "BUILD Series Navy Back Graphic View", isPrimary: false, displayOrder: 1 },
        { url: "/images/products/build-model-navy-front.jpg", alt: "BUILD Series Navy Model Front", isPrimary: false, displayOrder: 2 },
        { url: "/images/products/build-model-navy-back.jpg", alt: "BUILD Series Navy Model Back", isPrimary: false, displayOrder: 3 },
        { url: "/images/campaign/build-artwork.jpg", alt: "Building A Better Tomorrow Artwork", isPrimary: false, displayOrder: 4 },
        { url: "/images/campaign/build-series-navy.jpg", alt: "BUILD Series Navy Campaign Board", isPrimary: false, displayOrder: 5 },
      ],
      colorName: "Midnight Navy",
      colorHex: "#1B2430",
    },
    {
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (BURGUNDY)",
      slug: "build-series-better-tomorrow-tee-burgundy",
      description: "The core Burgundy Wine edition. Crafted from 240 GSM premium combed cotton with deep wine-red wash. Features front chest typography and high-definition architectural globe screenprint on the rear.",
      fabric: "100% Premium Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      printType: "High-Density Screen Print",
      printPlacement: "Front Chest & Full Back Graphic",
      artwork: "Building A Better Tomorrow Official Graphic",
      basePrice: 1699,
      originalPrice: 2699,
      isFeatured: true,
      isBestseller: true,
      isNewDrop: true,
      isLimited: false,
      rating: 4.9,
      reviewCount: 42,
      categoryId: category.id,
      collectionId: collection.id,
      images: [
        { url: "/images/products/build-model-burgundy-front.jpg", alt: "BUILD Series Burgundy Model Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-burgundy-back.jpg", alt: "BUILD Series Burgundy Model Back", isPrimary: false, displayOrder: 1 },
        { url: "/images/campaign/build-series-burgundy.jpg", alt: "BUILD Series Burgundy Campaign Board", isPrimary: false, displayOrder: 2 },
        { url: "/images/campaign/build-artwork.jpg", alt: "Building A Better Tomorrow Artwork", isPrimary: false, displayOrder: 3 },
      ],
      colorName: "Burgundy Wine",
      colorHex: "#581825",
    },
    {
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (VINTAGE SAND)",
      slug: "build-series-better-tomorrow-tee-sand",
      description: "The core Vintage Sand edition. Milled from 240 GSM heavy organic cotton in neutral bone-tan tone with tonal and contrasting chocolate-noir graphic hits.",
      fabric: "100% Premium Cotton (240 GSM)",
      gsm: 240,
      fit: "Oversized Boxy Fit",
      printType: "High-Density Screen Print",
      printPlacement: "Front Chest & Full Back Graphic",
      artwork: "Building A Better Tomorrow Official Graphic",
      basePrice: 1699,
      originalPrice: 2699,
      isFeatured: true,
      isBestseller: false,
      isNewDrop: true,
      isLimited: false,
      rating: 4.9,
      reviewCount: 38,
      categoryId: category.id,
      collectionId: collection.id,
      images: [
        { url: "/images/products/build-model-sand-front.jpg", alt: "BUILD Series Sand Model Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-sand-back.jpg", alt: "BUILD Series Sand Model Back", isPrimary: false, displayOrder: 1 },
        { url: "/images/campaign/build-series-sand.jpg", alt: "BUILD Series Sand Campaign Board", isPrimary: false, displayOrder: 2 },
        { url: "/images/campaign/build-artwork.jpg", alt: "Building A Better Tomorrow Artwork", isPrimary: false, displayOrder: 3 },
      ],
      colorName: "Vintage Sand",
      colorHex: "#D2B48C",
    },
  ];

  for (const item of productsToAdd) {
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug }
    });

    if (existing) {
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          description: item.description,
          fabric: item.fabric,
          gsm: item.gsm,
          fit: item.fit,
          basePrice: item.basePrice,
          originalPrice: item.originalPrice,
          isFeatured: item.isFeatured,
          isBestseller: item.isBestseller,
          isNewDrop: item.isNewDrop,
          isLimited: item.isLimited,
          rating: item.rating,
          reviewCount: item.reviewCount,
          collectionId: collection.id,
          images: {
            create: item.images,
          }
        }
      });
      console.log(`Updated existing product: ${item.slug}`);
    } else {
      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          description: item.description,
          fabric: item.fabric,
          gsm: item.gsm,
          fit: item.fit,
          printType: item.printType,
          printPlacement: item.printPlacement,
          artwork: item.artwork,
          basePrice: item.basePrice,
          originalPrice: item.originalPrice,
          isFeatured: item.isFeatured,
          isBestseller: item.isBestseller,
          isNewDrop: item.isNewDrop,
          isLimited: item.isLimited,
          rating: item.rating,
          reviewCount: item.reviewCount,
          categoryId: item.categoryId,
          collectionId: item.collectionId,
          images: {
            create: item.images,
          },
          variants: {
            create: ["S", "M", "L", "XL", "XXL"].map((sz) => ({
              size: sz,
              color: item.colorName,
              colorHex: item.colorHex,
              sku: `BUILD-${item.colorName.slice(0, 3).toUpperCase()}-${sz}-240`,
              stock: 30,
            })),
          },
        }
      });
      console.log(`Created new flagship product: ${item.slug}`);
    }
  }

  console.log('--- Finished adding BUILD Series products! ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
