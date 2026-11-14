import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Upgrading Product Images in dev.db ---');
  const images = await prisma.productImage.findMany();
  console.log(`Found ${images.length} product images.`);

  for (const img of images) {
    let newUrl = img.url;
    // Upgrade unsplash urls to high resolution (w=2400, q=95)
    if (newUrl.includes('images.unsplash.com')) {
      newUrl = newUrl
        .replace(/w=\d+/, 'w=2400')
        .replace(/q=\d+/, 'q=95');
      if (!newUrl.includes('w=2400')) {
        newUrl += '&w=2400&q=95';
      }
    }
    let newAlt = img.alt || '';
    if (newAlt.includes('Hoodie')) {
      newAlt = newAlt.replace(/Hoodie/g, 'Tee');
    }

    if (newUrl !== img.url || newAlt !== img.alt) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl, alt: newAlt }
      });
      console.log(`Updated ProductImage ${img.id}: ${newUrl}`);
    }
  }

  // Upgrade Categories image URLs
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    if (cat.image && cat.image.includes('images.unsplash.com')) {
      const newImg = cat.image.replace(/w=\d+/, 'w=2400').replace(/q=\d+/, 'q=95');
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: newImg }
      });
      console.log(`Updated Category ${cat.slug} image to 2.4K`);
    }
  }

  // Upgrade DropCountdown
  const drops = await prisma.dropCountdown.findMany();
  for (const drop of drops) {
    if (drop.imageUrl && drop.imageUrl.includes('images.unsplash.com')) {
      const newImg = drop.imageUrl.replace(/w=\d+/, 'w=2400').replace(/q=\d+/, 'q=95');
      await prisma.dropCountdown.update({
        where: { id: drop.id },
        data: { imageUrl: newImg }
      });
      console.log(`Updated DropCountdown ${drop.title} image to 2.4K`);
    }
  }

  console.log('All database images successfully upgraded to ultra-clear high resolution!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
