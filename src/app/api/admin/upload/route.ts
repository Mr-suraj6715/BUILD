import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";

    // Handle multipart/form-data upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const type = (formData.get("type") as string) || "product"; // "front" | "hover" | "product"

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Check allowed MIME types
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file format. Please upload JPG, PNG, WEBP, or AVIF." },
          { status: 400 }
        );
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = file.name.split(".").pop() || "jpg";
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase()
        .replace(/\.[^/.]+$/, "");
      const fileName = `${type}_${Date.now()}_${sanitizedName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/products/${fileName}`;
      return NextResponse.json({ success: true, url: fileUrl, fileName });
    }

    // Handle JSON upload (Base64 string or remote URL validation)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { base64, filename, url, type = "product" } = body;

      if (url) {
        // Return validated URL
        return NextResponse.json({ success: true, url });
      }

      if (base64) {
        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return NextResponse.json({ error: "Invalid base64 image data" }, { status: 400 });
        }

        const mime = matches[1];
        const data = matches[2];
        const ext = mime.split("/")[1] || "jpg";

        const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${type}_${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, Buffer.from(data, "base64"));

        return NextResponse.json({ success: true, url: `/uploads/products/${fileName}` });
      }
    }

    return NextResponse.json({ error: "Unsupported request format" }, { status: 400 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to process upload" }, { status: 500 });
  }
}
