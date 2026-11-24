import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Simple sanitizer for SVG to prevent XSS
function sanitizeSvg(svgContent: string): string {
  // Strip out script tags and event handlers
  return svgContent
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads", "custom");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 1. Multipart Form Data handling
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const side = (formData.get("side") as string) || "artwork"; // "front" | "back" | "artwork"

      if (!file) {
        return NextResponse.json({ error: "No artwork file provided." }, { status: 400 });
      }

      const allowedMimes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ];
      const allowedExtensions = /\.(png|jpe?g|webp|svg)$/i;

      if (!allowedMimes.includes(file.type) && !allowedExtensions.test(file.name)) {
        return NextResponse.json(
          { error: "Invalid format. Only PNG, JPG, JPEG, WebP, and SVG are supported." },
          { status: 400 }
        );
      }

      // Max size: 25MB
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File exceeds 25MB maximum limit. Please optimize your graphic." },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const sanitizedBase = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase()
        .replace(/\.[^/.]+$/, "");
      const fileName = `${side}_${Date.now()}_${sanitizedBase}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      if (ext === "svg") {
        const text = await file.text();
        const safeSvg = sanitizeSvg(text);
        await fs.promises.writeFile(filePath, safeSvg, "utf8");
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Try Cloudinary cloud storage
        const cloudUpload = await uploadToCloudinary(buffer, `build_clothing/custom/${side}`);
        if (cloudUpload.success) {
          return NextResponse.json({
            success: true,
            url: cloudUpload.url,
            fileName: file.name,
            size: file.size,
          });
        }

        await fs.promises.writeFile(filePath, buffer);
      }

      const fileUrl = `/uploads/custom/${fileName}`;
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName: file.name,
        size: file.size,
      });
    }

    // 2. Base64 payload handling
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { base64, side = "artwork", fileName: originalName = "graphic" } = body;

      if (!base64 || typeof base64 !== "string") {
        return NextResponse.json({ error: "Artwork data required." }, { status: 400 });
      }

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: "Invalid image format data." }, { status: 400 });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      const extMap: Record<string, string> = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/webp": "webp",
        "image/svg+xml": "svg",
      };

      const ext = extMap[mimeType] || "png";
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 25 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 25MB limit." }, { status: 400 });
      }

      const safeBase = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const fileName = `${side}_${Date.now()}_${safeBase}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Try Cloudinary cloud storage
      const cloudUpload = await uploadToCloudinary(base64, `build_clothing/custom/${side}`);
      if (cloudUpload.success) {
        return NextResponse.json({
          success: true,
          url: cloudUpload.url,
          fileName: originalName,
          size: buffer.length,
        });
      }

      if (ext === "svg") {
        const safeSvg = sanitizeSvg(buffer.toString("utf8"));
        await fs.promises.writeFile(filePath, safeSvg, "utf8");
      } else {
        await fs.promises.writeFile(filePath, buffer);
      }

      const fileUrl = `/uploads/custom/${fileName}`;
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName,
        size: buffer.length,
      });
    }

    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 });
  } catch (error: any) {
    console.error("Studio artwork upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed: " + (error?.message || "Internal server error") },
      { status: 500 }
    );
  }
}
