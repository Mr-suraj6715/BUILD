import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Migrating catalog to STRICT T-SHIRTS ONLY...");

  // 1. Ensure the 6 canonical T-Shirt Categories exist
  const categoryDefs = [
    {
      name: "ALL T-SHIRTS",
      slug: "all-t-shirts",
      description: "The complete archive of heavyweight, graphic, minimal, and oversized streetwear tees.",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "OVERSIZED T-SHIRTS",
      slug: "oversized-t-shirts",
      description: "Heavyweight drop-shoulder graphic tees crafted for the perfect Gen Z boxy drape.",
      image: "/images/stitch/collection-oversized.jpg",
    },
    {
      name: "GRAPHIC T-SHIRTS",
      slug: "graphic-t-shirts",
      description: "High-density silkscreen, cyberpunk, anime, and distorted typography hits.",
      image: "/images/stitch/collection-graphic.jpg",
    },
    {
      name: "CUSTOM PRINTED T-SHIRTS",
      slug: "custom-printed-t-shirts",
      description: "Design your own custom oversized tee blanks with 1200 DPI Kornit print labs.",
      image: "/images/stitch/custom-mockup.png",
    },
    {
      name: "MINIMAL T-SHIRTS",
      slug: "minimal-t-shirts",
      description: "Understated luxury, subtle tonal chest typography, and clean boxy silhouettes.",
      image: "/images/stitch/collection-original.jpg",
    },
    {
      name: "LIMITED EDITION T-SHIRTS",
      slug: "limited-edition-t-shirts",
      description: "Numbered capsules and archive drops strictly limited to single runs.",
      image: "/images/stitch/collection-drops.jpg",
    },
  ];

  const catMap = {};
  for (const c of categoryDefs) {
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (existing) {
      catMap[c.slug] = await prisma.category.update({
        where: { id: existing.id },
        data: { name: c.name, description: c.description, image: c.image },
      });
    } else {
      catMap[c.slug] = await prisma.category.create({ data: c });
    }
  }

  // 2. Transform any non-t-shirt products into T-shirt counterparts so existing orders/references are preserved
  const hoodie1 = await prisma.product.findUnique({ where: { slug: "kaiju-protocol-420-gsm-hoodie" } });
  if (hoodie1) {
    await prisma.product.update({
      where: { id: hoodie1.id },
      data: {
        title: "KAIJU PROTOCOL 280 GSM OVERSIZED TEE",
        slug: "kaiju-protocol-280-gsm-oversized-tee",
        description: "Heavyweight Tokyo drop-shoulder silhouette. 280 GSM luxury combed organic cotton with massive biomechanical cyber kaiju screenprint on back and high-density chest typography.",
        fabric: "100% Combed Ringspun Cotton (280 GSM)",
        gsm: 280,
        fit: "Tokyo Boxy Fit",
        printType: "High-Density 3D Rubber & Screenprint",
        printPlacement: "Chest & Full Back",
        artwork: "Kaiju Protocol Mecha 04",
        basePrice: 1999,
        originalPrice: 2499,
        categoryId: catMap["limited-edition-t-shirts"].id,
      },
    });
  }

  const hoodie2 = await prisma.product.findUnique({ where: { slug: "cyberpunk-ronin-mecha-hoodie" } });
  if (hoodie2) {
    await prisma.product.update({
      where: { id: hoodie2.id },
      data: {
        title: "CYBER RONIN ANIME GRAPHIC TEE",
        slug: "cyber-ronin-anime-graphic-tee",
        description: "Original cyber-katana anime graphic on vintage enzyme-washed 260 GSM jersey. High-density tactile inks with distressed water-based chest hit.",
        fabric: "100% Heavyweight Cotton (260 GSM)",
        gsm: 260,
        fit: "Drop-Shoulder Boxy Cut",
        printType: "Acid-Resistant Screenprint",
        printPlacement: "Full Back Artwork & Chest Hit",
        artwork: "Neo-Tokyo Ronin Katana V2",
        basePrice: 1899,
        originalPrice: 2599,
        categoryId: catMap["graphic-t-shirts"].id,
      },
    });
  }

  const sweatshirt = await prisma.product.findUnique({ where: { slug: "astral-drift-box-sweatshirt" } });
  if (sweatshirt) {
    await prisma.product.update({
      where: { id: sweatshirt.id },
      data: {
        title: "ASTRAL DRIFT MINIMAL TYPOGRAPHY TEE",
        slug: "astral-drift-minimal-typography-tee",
        description: "Understated streetwear luxury for minimalists. 240 GSM organic combed yarn with subtle tonal chest typography emblem.",
        fabric: "100% Combed Organic Cotton (240 GSM)",
        gsm: 240,
        fit: "Wide Box Cut",
        printType: "Tonal High-Density Rubber",
        printPlacement: "Subtle Center Chest",
        artwork: "Astral Drift Minimal Vector",
        basePrice: 1499,
        originalPrice: 1999,
        categoryId: catMap["minimal-t-shirts"].id,
      },
    });
  }

  // 3. Remap all other products into one of the 6 canonical T-Shirt categories
  const allProducts = await prisma.product.findMany();
  for (const p of allProducts) {
    let targetCatId = catMap["all-t-shirts"].id;

    if (p.slug.includes("oversized") || p.fit.toLowerCase().includes("oversized") || p.fit.toLowerCase().includes("boxy")) {
      targetCatId = catMap["oversized-t-shirts"].id;
    } else if (p.slug.includes("graphic") || p.slug.includes("glitch") || p.slug.includes("chaos") || p.slug.includes("ronin")) {
      targetCatId = catMap["graphic-t-shirts"].id;
    } else if (p.slug.includes("minimal") || p.slug.includes("matrix") || p.slug.includes("astral") || p.slug.includes("culture")) {
      targetCatId = catMap["minimal-t-shirts"].id;
    } else if (p.isLimited || p.slug.includes("dreams") || p.slug.includes("kaiju")) {
      targetCatId = catMap["limited-edition-t-shirts"].id;
    } else if (p.slug.includes("custom")) {
      targetCatId = catMap["custom-printed-t-shirts"].id;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        categoryId: targetCatId,
        printType: p.printType || "High-Density Screen Print",
        printPlacement: p.printPlacement || "Front & Back",
        artwork: p.artwork || `${p.title} Signature Vector`,
      },
    });
  }

  // 4. Ensure Custom Studio Blank Tee exists
  const customTee = await prisma.product.findUnique({ where: { slug: "custom-studio-heavy-box-tee" } });
  if (!customTee) {
    const createdCustom = await prisma.product.create({
      data: {
        title: "CUSTOM STUDIO 260 GSM OVERSIZED TEE BLANK",
        slug: "custom-studio-heavy-box-tee",
        description: "The ultimate streetwear canvas. 260 GSM combed cotton blank engineered for direct-to-garment (DTG) and screen printing. Custom artwork uploads printed at 1200 DPI.",
        fabric: "100% Combed Ringspun Cotton (260 GSM)",
        gsm: 260,
        fit: "Oversized Boxy Fit",
        printType: "1200 DPI Kornit DTG",
        printPlacement: "Custom Placement (Front/Back)",
        artwork: "Client Custom Upload",
        basePrice: 999,
        originalPrice: 1499,
        isFeatured: true,
        isBestseller: true,
        isNewDrop: true,
        categoryId: catMap["custom-printed-t-shirts"].id,
        images: {
          create: [
            { url: "/images/stitch/custom-mockup.png", alt: "Custom T-Shirt Studio Blank", isPrimary: true, displayOrder: 0 },
            { url: "/images/stitch/product-3-front.jpg", alt: "Custom T-Shirt Bone White", isPrimary: false, displayOrder: 1 },
          ],
        },
        variants: {
          create: ["S", "M", "L", "XL", "XXL"].map((sz) => ({
            size: sz,
            color: "Pitch Black",
            colorHex: "#151515",
            sku: `CST-TEE-BLK-${sz}`,
            stock: 50,
            additionalPrice: 0,
          })),
        },
      },
    });
    console.log("Created Custom Studio Blank Tee:", createdCustom.slug);
  }

  // 5. Delete old non-T-Shirt categories
  const targetCategorySlugs = [
    "all-t-shirts",
    "oversized-t-shirts",
    "graphic-t-shirts",
    "custom-printed-t-shirts",
    "minimal-t-shirts",
    "limited-edition-t-shirts",
  ];

  const oldCategories = await prisma.category.findMany({
    where: {
      slug: { notIn: targetCategorySlugs },
    },
  });

  for (const oldCat of oldCategories) {
    await prisma.category.delete({ where: { id: oldCat.id } });
    console.log(`Deleted non-tshirt category: ${oldCat.name} (${oldCat.slug})`);
  }

  console.log("Migration finished successfully! Catalog is strictly 100% T-SHIRTS.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

