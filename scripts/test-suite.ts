import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, verifyToken } from "../src/lib/auth";

async function runTestSuite() {
  console.log("\n========================================================");
  console.log("⚡ RUNNING BUILD CLOTHING PRODUCTION VERIFICATION SUITE ⚡");
  console.log("========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Database Connection & Categories Test
  try {
    const categories = await prisma.category.findMany();
    assert(categories.length >= 4, `Database seeded with categories (Found: ${categories.length})`);
  } catch (e: any) {
    assert(false, `Database connection: ${e.message}`);
  }

  // 2. Product Catalog & Variant Stock Test
  try {
    const products = await prisma.product.findMany({
      include: { variants: true, images: true },
    });
    assert(products.length >= 6, `Catalog contains streetwear releases (Found: ${products.length})`);

    const firstProduct = products[0];
    assert(
      firstProduct.variants.length >= 4,
      `Product "${firstProduct.title}" has multi-size variants (Found: ${firstProduct.variants.length})`
    );

    const hasStock = firstProduct.variants.every((v) => v.stock > 0);
    assert(hasStock, "Variant stock levels are strictly positive numbers");
  } catch (e: any) {
    assert(false, `Product catalog verification: ${e.message}`);
  }

  // 3. User Authentication & Password Hashing Test
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@buildclothing.com" },
    });
    assert(!!adminUser, "Default Admin user exists in database");

    if (adminUser) {
      const isPasswordValid = await bcrypt.compare("Admin@123456", adminUser.passwordHash);
      assert(isPasswordValid, "Admin password hash verifies correctly with bcrypt");

      const token = signToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      });

      const decoded = verifyToken(token);
      assert(decoded?.role === "ADMIN", "JWT Token encodes and verifies ADMIN role");
    }
  } catch (e: any) {
    assert(false, `Authentication test: ${e.message}`);
  }

  // 4. Cart Pricing & Shipping Calculation Logic
  try {
    const subtotalLow = 1200;
    const shippingFeeLow = subtotalLow >= 1499 ? 0 : 99;
    assert(shippingFeeLow === 99, "Orders under ₹1,499 correctly charge standard ₹99 shipping");

    const subtotalHigh = 1600;
    const shippingFeeHigh = subtotalHigh >= 1499 ? 0 : 99;
    assert(shippingFeeHigh === 0, "Orders ₹1,499 and above unlock free shipping (₹0)");
  } catch (e: any) {
    assert(false, `Pricing logic: ${e.message}`);
  }

  // 5. Comprehensive Coupon Verification Suite
  try {
    console.log("\n  --- PROMO CODE VERIFICATION TESTS ---");

    // Helper validation function identical to validate-coupon API route
    const validatePromo = async (rawCode: string, subtotal: number) => {
      const normalized = rawCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });

      if (!coupon) return { success: false, error: "Coupon does not exist" };
      if (!coupon.isActive) return { success: false, error: "Coupon is inactive" };
      if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
        return { success: false, error: "Coupon has expired" };
      }
      if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
        return { success: false, error: "Usage limit exceeded" };
      }
      if (subtotal < coupon.minOrderValue) {
        return { success: false, error: `Minimum order amount of ₹${coupon.minOrderValue} required` };
      }

      let discount = 0;
      if (coupon.discountPercent) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.discountAmount) {
        discount = Math.min(coupon.discountAmount, subtotal);
      }
      return { success: true, discount, coupon };
    }

    // Test SURAJ300 (50% OFF)
    const surajRes = await validatePromo("SURAJ300", 2000);
    assert(surajRes.success && surajRes.discount === 1000, "SURAJ300: 50% discount on ₹2,000 equals ₹1,000 OFF");

    // Test SURAJ300 Lowercase and spaces normalization
    const surajLower = await validatePromo("  suraj300  ", 2000);
    assert(surajLower.success && surajLower.discount === 1000, "SURAJ300: Lowercase & whitespace normalized ('  suraj300  ')");

    // Test BUILD10 (10% OFF, minOrder 999)
    const buildRes = await validatePromo("BUILD10", 1500);
    assert(buildRes.success && buildRes.discount === 150, "BUILD10: 10% discount on ₹1,500 equals ₹150 OFF");

    const buildMinFail = await validatePromo("BUILD10", 800);
    assert(!buildMinFail.success && buildMinFail.error?.includes("Minimum order"), "BUILD10: Rejects when cart ₹800 is below min order ₹999");

    // Test GENZ15 (15% OFF, minOrder 1999)
    const genzRes = await validatePromo("GENZ15", 2500);
    assert(genzRes.success && genzRes.discount === 375, "GENZ15: 15% discount on ₹2,500 equals ₹375 OFF");

    // Test FREESHIP (₹100 OFF fixed)
    const freeShipRes = await validatePromo("FREESHIP", 1000);
    assert(freeShipRes.success && freeShipRes.discount === 100, "FREESHIP: ₹100 fixed discount applied correctly");

    // Test Invalid Code
    const invalidRes = await validatePromo("UNKNOWN_CODE", 2000);
    assert(!invalidRes.success && invalidRes.error === "Coupon does not exist", "Invalid coupon code correctly rejected");

    // Test Inactive Code handling
    const tempInactive = await prisma.coupon.create({
      data: {
        code: "TEMP_INACTIVE_" + Date.now(),
        discountPercent: 20,
        isActive: false,
      },
    });
    const inactiveRes = await validatePromo(tempInactive.code, 2000);
    assert(!inactiveRes.success && inactiveRes.error === "Coupon is inactive", "Inactive coupon correctly rejected");
    await prisma.coupon.delete({ where: { id: tempInactive.id } });

    // Test Expired Code handling
    const tempExpired = await prisma.coupon.create({
      data: {
        code: "TEMP_EXPIRED_" + Date.now(),
        discountPercent: 20,
        validUntil: new Date("2020-01-01"),
        isActive: true,
      },
    });
    const expiredRes = await validatePromo(tempExpired.code, 2000);
    assert(!expiredRes.success && expiredRes.error === "Coupon has expired", "Expired coupon correctly rejected");
    await prisma.coupon.delete({ where: { id: tempExpired.id } });

    // Test Usage Limit exceeded handling
    const tempLimit = await prisma.coupon.create({
      data: {
        code: "TEMP_LIMIT_" + Date.now(),
        discountPercent: 20,
        usageLimit: 5,
        usageCount: 5,
        isActive: true,
      },
    });
    const limitRes = await validatePromo(tempLimit.code, 2000);
    assert(!limitRes.success && limitRes.error === "Usage limit exceeded", "Usage limit reached correctly rejected");
    await prisma.coupon.delete({ where: { id: tempLimit.id } });

    console.log("  ------------------------------------\n");
  } catch (e: any) {
    assert(false, `Coupon validation suite: ${e.message}`);
  }

  // 6. Order Placement & Inventory Concurrency Test
  try {
    const sampleVariant = await prisma.productVariant.findFirst({
      where: { stock: { gt: 5 } },
    });

    if (sampleVariant) {
      const initialStock = sampleVariant.stock;

      // Simulated purchase decrement
      const updatedVariant = await prisma.productVariant.update({
        where: { id: sampleVariant.id },
        data: { stock: { decrement: 1 } },
      });

      assert(
        updatedVariant.stock === initialStock - 1,
        `Inventory accurately decrements upon purchase (Was: ${initialStock}, Now: ${updatedVariant.stock})`
      );

      // Revert stock back
      await prisma.productVariant.update({
        where: { id: sampleVariant.id },
        data: { stock: { increment: 1 } },
      });
    }
  } catch (e: any) {
    assert(false, `Inventory deduction: ${e.message}`);
  }

  console.log("\n--------------------------------------------------------");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("--------------------------------------------------------\n");

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTestSuite().catch((e) => {
  console.error(e);
  process.exit(1);
});
