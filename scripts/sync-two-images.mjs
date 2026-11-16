import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hoverImagePairs = {
  'chromatic-chaos-acid-oversized-tee': {
    front: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=2400&q=95',
    hover: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=2400&q=95',
  },
  'void-matrix-minimalist-box-tee': {
    front: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=95',
    hover: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2400&q=95',
  },
  'cyber-ronin-anime-graphic-tee': {
    front: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=2400&q=95',
    hover: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=2400&q=95',
  },
  'no-signal-retro-glitch-tee': {
    front: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=2400&q=95',
    hover: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2400&q=95',
  },
  'astral-drift-minimal-typography-tee': {
    front: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2400&q=95',
    hover: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95',
  },
};

async function main() {
  console.log('--- Synchronizing Two-Image Hover System for All Products ---');
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { displayOrder: 'asc' } } }
  });

  for (const product of products) {
    console.log(`Checking "${product.title}" (${product.slug})...`);

    // If it's one of the products that needs a second image
    if (hoverImagePairs[product.slug]) {
      const pair = hoverImagePairs[product.slug];
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.createMany({
        data: [
          {
            productId: product.id,
            url: pair.front,
            alt: `${product.title} Front View`,
            isPrimary: true,
            displayOrder: 0,
          },
          {
            productId: product.id,
            url: pair.hover,
            alt: `${product.title} Hover Alternate Angle`,
            isPrimary: false,
            displayOrder: 1,
          },
        ]
      });
      console.log(`  -> Configured Image 1 & Image 2 hover pair for ${product.slug}`);
    } else if (product.images.length === 1) {
      // Fallback: create a complementary alternate view if missing
      const firstImg = product.images[0].url;
      const altUrl = firstImg.includes('stitch') 
        ? firstImg.replace('-front', '-back')
        : firstImg;
      if (altUrl !== firstImg) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: altUrl,
            alt: `${product.title} Back View`,
            isPrimary: false,
            displayOrder: 1,
          }
        });
        console.log(`  -> Added missing hover image for ${product.slug}`);
      }
    } else {
      console.log(`  -> Already has ${product.images.length} images (Front + Alternate/Back).`);
    }
  }

  console.log('--- Finished syncing two-image system! ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
