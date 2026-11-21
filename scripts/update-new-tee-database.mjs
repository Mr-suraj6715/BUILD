import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function update() {
  console.log("--- Updating Product Image Records in Database ---");

  // 1. Update THE BUILD SERIES Collection
  const collection = await prisma.collection.findFirst({
    where: { slug: "the-build-series" }
  });
  if (collection) {
    await prisma.collection.update({
      where: { id: collection.id },
      data: {
        image: "/images/campaign/build-series-flatlay.jpg",
      }
    });
    console.log("Updated THE BUILD SERIES collection image -> /images/campaign/build-series-flatlay.jpg");
  }

  // 2. Map of BUILD Series Products and their new image galleries
  const buildProducts = [
    {
      slug: "build-series-better-tomorrow-tee-navy",
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (NAVY)",
      images: [
        { url: "/images/products/build-model-navy-front.jpg", alt: "BUILD Series Navy Model Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-navy-back.jpg", alt: "BUILD Series Navy Model Back Graphic", isPrimary: false, displayOrder: 1 },
        { url: "/images/products/build-series-navy-front.jpg", alt: "BUILD Series Navy Flat Front", isPrimary: false, displayOrder: 2 },
        { url: "/images/products/build-series-navy-back.jpg", alt: "BUILD Series Navy Flat Back", isPrimary: false, displayOrder: 3 },
        { url: "/images/products/build-detail-navy-chest.jpg", alt: "BUILD Series Navy Chest Detail", isPrimary: false, displayOrder: 4 },
        { url: "/images/campaign/build-series-navy.jpg", alt: "BUILD Series Navy Full Campaign Board", isPrimary: false, displayOrder: 5 },
      ]
    },
    {
      slug: "build-series-better-tomorrow-tee-burgundy",
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (MAROON)",
      images: [
        { url: "/images/products/build-model-burgundy-front.jpg", alt: "BUILD Series Maroon Model Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-burgundy-back.jpg", alt: "BUILD Series Maroon Model Back Graphic", isPrimary: false, displayOrder: 1 },
        { url: "/images/products/build-series-burgundy-front.jpg", alt: "BUILD Series Maroon Flat Front", isPrimary: false, displayOrder: 2 },
        { url: "/images/products/build-series-burgundy-back.jpg", alt: "BUILD Series Maroon Flat Back", isPrimary: false, displayOrder: 3 },
        { url: "/images/products/build-detail-burgundy-chest.jpg", alt: "BUILD Series Maroon Chest Detail", isPrimary: false, displayOrder: 4 },
        { url: "/images/campaign/build-series-burgundy.jpg", alt: "BUILD Series Maroon Full Campaign Board", isPrimary: false, displayOrder: 5 },
      ]
    },
    {
      slug: "build-series-better-tomorrow-tee-sand",
      title: "BUILD SERIES: BUILDING A BETTER TOMORROW TEE (BEIGE)",
      images: [
        { url: "/images/products/build-model-sand-front.jpg", alt: "BUILD Series Beige Model Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-sand-back.jpg", alt: "BUILD Series Beige Model Back Graphic", isPrimary: false, displayOrder: 1 },
        { url: "/images/products/build-series-sand-front.jpg", alt: "BUILD Series Beige Flat Front", isPrimary: false, displayOrder: 2 },
        { url: "/images/products/build-series-sand-back.jpg", alt: "BUILD Series Beige Flat Back", isPrimary: false, displayOrder: 3 },
        { url: "/images/products/build-detail-sand-chest.jpg", alt: "BUILD Series Beige Chest Detail", isPrimary: false, displayOrder: 4 },
        { url: "/images/campaign/build-series-sand.jpg", alt: "BUILD Series Beige Full Campaign Board", isPrimary: false, displayOrder: 5 },
      ]
    },
    {
      slug: "custom-studio-heavy-box-tee",
      title: "CUSTOM STUDIO 260 GSM OVERSIZED TEE BLANK",
      images: [
        { url: "/images/products/build-model-navy-front.jpg", alt: "BUILD Custom Studio Blank Front", isPrimary: true, displayOrder: 0 },
        { url: "/images/products/build-model-navy-back.jpg", alt: "BUILD Custom Studio Blank Back", isPrimary: false, displayOrder: 1 },
      ]
    }
  ];

  for (const bp of buildProducts) {
    const product = await prisma.product.findFirst({
      where: { slug: bp.slug }
    });
    if (product) {
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      });
      await prisma.productImage.createMany({
        data: bp.images.map(img => ({
          productId: product.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        }))
      });
      console.log(`Updated images for product: ${bp.slug} (${bp.images.length} images)`);
    } else {
      console.log(`Product with slug ${bp.slug} not found in database.`);
    }
  }

  // 3. Also check if other products reference any old stitch images or need front/hover updates
  const allProducts = await prisma.product.findMany({
    include: { images: { orderBy: { displayOrder: 'asc' } } }
  });
  console.log(`\nVerified ${allProducts.length} total products in database:`);
  for (const p of allProducts) {
    console.log(`- ${p.title} (${p.slug}): ${p.images.length} images. Primary: ${p.images[0]?.url}`);
  }

  console.log("\n--- Database Image Sync Complete! ---");
}

update()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
