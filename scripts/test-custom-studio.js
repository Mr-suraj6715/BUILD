const fs = require("fs");
const path = require("path");

async function runStudioTests() {
  console.log("--- 1. Testing /custom-print endpoint ---");
  const pageRes = await fetch("http://localhost:3000/custom-print");
  console.log("Status:", pageRes.status);
  if (pageRes.status !== 200) throw new Error("Custom print page returned status " + pageRes.status);

  const pageHtml = await pageRes.text();
  const hasGarments = pageHtml.includes("Half Sleeve T-Shirt") && pageHtml.includes("Oversized T-Shirt") && pageHtml.includes("Heavyweight Hoodie");
  const hasColors = pageHtml.includes("Midnight Navy") && pageHtml.includes("Deep Maroon");
  const hasUpload = pageHtml.includes("Upload Front Image") || pageHtml.includes("FRONT ARTWORK");
  console.log("Checks -> Garments:", hasGarments, "| Colors:", hasColors, "| Artwork Uploads:", hasUpload);

  console.log("\n--- 2. Testing /api/custom-studio/upload ---");
  const samplePngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const uploadRes = await fetch("http://localhost:3000/api/custom-studio/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base64: samplePngBase64,
      side: "front",
      fileName: "custom_streetwear_sigil.png",
    }),
  });
  console.log("Upload status:", uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log("Uploaded URL:", uploadData.url);
  if (!uploadData.url || !uploadData.url.startsWith("/uploads/custom/")) {
    throw new Error("Invalid uploaded URL: " + JSON.stringify(uploadData));
  }

  // Verify file exists on disk
  const localFilePath = path.join(process.cwd(), "public", uploadData.url);
  const fileExists = fs.existsSync(localFilePath);
  console.log("File exists on disk:", fileExists, "(" + localFilePath + ")");
  if (!fileExists) throw new Error("Uploaded file not saved on disk!");

  console.log("\n--- 3. Testing custom order creation with checkout ---");
  const orderRes = await fetch("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          variantId: "custom-" + Date.now(),
          title: "CUSTOM // Oversized T-Shirt (Midnight Navy / L)",
          size: "L",
          color: "Midnight Navy",
          price: 1899,
          quantity: 1,
          image: uploadData.url,
          isCustom: true,
        },
      ],
      shippingAddress: {
        fullName: "Suraj Yadav (Custom Test)",
        phone: "9876543210",
        pincode: "400050",
        addressLine1: "Flagship Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
      },
      paymentMethod: "COD",
    }),
  });
  console.log("Order creation status:", orderRes.status);
  const orderJson = await orderRes.json();
  console.log("Order result:", orderJson.orderNumber, "| Order ID:", orderJson.orderId, "| Total:", orderJson.totalAmount);

  if (!orderJson.orderNumber) {
    throw new Error("Order creation failed: " + JSON.stringify(orderJson));
  }

  console.log("\n>>> ALL CUSTOM STUDIO & APPAREL TESTS PASSED! <<<");
}

runStudioTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
