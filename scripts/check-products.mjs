import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { displayOrder: 'asc' } } }
  });
  console.log(`Total Products: ${products.length}`);
  for (const p of products) {
    console.log(`\nProduct: "${p.title}" (slug: ${p.slug})`);
    console.log(`Images (${p.images.length}):`);
    p.images.forEach((img, i) => {
      console.log(`  #${i + 1} [isPrimary: ${img.isPrimary}, order: ${img.displayOrder}] alt: "${img.alt}" -> ${img.url}`);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
