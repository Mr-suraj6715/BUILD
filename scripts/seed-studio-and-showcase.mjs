import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const garments = [
  {
    id: "regular-fit",
    name: "Regular Fit T-Shirt",
    fit: "Classic Straight Cut",
    gsm: 190,
    fabric: "Pre-Shrunk Bio-Washed Cotton",
    basePrice: 999,
    description: "Daily classic straight cut silhouette engineered with durable twin needle stitching.",
    displayOrder: 1,
  },
  {
    id: "polo",
    name: "Polo T-Shirt",
    fit: "Structured Athletic",
    gsm: 260,
    fabric: "Pique Cotton Knit",
    basePrice: 1499,
    description: "Structured collar with ribbed cuffs and reinforced two-button placket.",
    displayOrder: 2,
  },
  {
    id: "hoodie",
    name: "Heavyweight Hoodie",
    fit: "Oversized Streetwear",
    gsm: 380,
    fabric: "100% French Terry Cotton",
    basePrice: 2499,
    description: "Drop shoulder heavyweight fleece with dual-layer hood and kangaroo pouch.",
    displayOrder: 3,
  },
  {
    id: "sweatshirt",
    name: "Crewneck Sweatshirt",
    fit: "Relaxed Raglan",
    gsm: 350,
    fabric: "Brushed Fleece Cotton",
    basePrice: 2199,
    description: "Ribbed V-notch collar with drop shoulder profile and reinforced hem.",
    displayOrder: 4,
  },
  {
    id: "half-sleeve",
    name: "Half Sleeve T-Shirt",
    fit: "Relaxed Everyday",
    gsm: 220,
    fabric: "Ringspun Combed Cotton",
    basePrice: 1199,
    description: "Relaxed streetwear drop with clean ribbed neckline and soft hand feel.",
    displayOrder: 5,
  },
  {
    id: "full-sleeve",
    name: "Full Sleeve T-Shirt",
    fit: "Tailored Street Fit",
    gsm: 240,
    fabric: "Heavyweight Cotton Jersey",
    basePrice: 1399,
    description: "Tailored long sleeve profile with ribbed cuffs and structured silhouette.",
    displayOrder: 6,
  },
  {
    id: "oversized",
    name: "Oversized T-Shirt",
    fit: "Boxy Street Drop",
    gsm: 240,
    fabric: "Heavy Combed Jersey",
    basePrice: 1299,
    description: "Signature wide boxy cut with drop shoulders and thick ribbed collar.",
    displayOrder: 7,
  },
];

const options = [
  { id: "front-only", type: "PRINT_SIDE", name: "Front Only", extra: 0, details: "INCLUDED", displayOrder: 1 },
  { id: "back-only", type: "PRINT_SIDE", name: "Back Only", extra: 100, details: "+₹100", displayOrder: 2 },
  { id: "both", type: "PRINT_SIDE", name: "Front + Back", extra: 250, details: "+₹250", displayOrder: 3 },
  { id: "dtg", type: "FINISH", name: "Kornit Ultra-HD DTG", extra: 0, details: "STANDARD (Soft hand feel)", displayOrder: 1 },
  { id: "puff", type: "FINISH", name: "3D Tactile Puff Print", extra: 200, details: "+₹200 (Raised screenprint)", displayOrder: 2 },
];

const showcase = [
  {
    id: "navy",
    name: "Midnight Navy",
    hex: "#1B2430",
    slug: "build-series-better-tomorrow-tee-navy",
    price: 1699,
    originalPrice: 2699,
    campaignImg: "/images/campaign/build-series-navy.jpg",
    frontImg: "/images/products/build-model-navy-front.jpg",
    backImg: "/images/products/build-model-navy-back.jpg",
    description: "Deep nocturnal navy with ivory screenprinted globe architecture and high-density front chest brandmark.",
    displayOrder: 1,
  },
  {
    id: "burgundy",
    name: "Burgundy Wine",
    hex: "#581825",
    slug: "build-series-better-tomorrow-tee-burgundy",
    price: 1699,
    originalPrice: 2699,
    campaignImg: "/images/campaign/build-series-burgundy.jpg",
    frontImg: "/images/products/build-model-burgundy-front.jpg",
    backImg: "/images/products/build-model-burgundy-back.jpg",
    description: "Rich vintage wine red cotton milled with enzyme treatment for an unmatched heavyweight drape.",
    displayOrder: 2,
  },
  {
    id: "sand",
    name: "Vintage Sand",
    hex: "#D2B48C",
    slug: "build-series-better-tomorrow-tee-sand",
    price: 1699,
    originalPrice: 2699,
    campaignImg: "/images/campaign/build-series-sand.jpg",
    frontImg: "/images/products/build-model-sand-front.jpg",
    backImg: "/images/products/build-model-sand-back.jpg",
    description: "Earthy bone-tan shade with deep noir architectural line art and understated chest identity.",
    displayOrder: 3,
  },
];

async function main() {
  console.log("Seeding Studio Garments...");
  for (const g of garments) {
    await prisma.studioGarment.upsert({
      where: { id: g.id },
      update: g,
      create: g,
    });
  }

  console.log("Seeding Studio Options...");
  for (const o of options) {
    await prisma.studioOption.upsert({
      where: { id: o.id },
      update: o,
      create: o,
    });
  }

  console.log("Seeding Homepage Showcase...");
  for (const s of showcase) {
    await prisma.homepageShowcase.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
