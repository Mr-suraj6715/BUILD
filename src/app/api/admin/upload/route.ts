import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
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

    // Handle direct multipart/form-data upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const type = (formData.get("type") as string) || "product"; // "front" | "hover" | "product" | "showcase"

      if (!file) {
        return NextResponse.json({ error: "No image file provided." }, { status: 400 });
      }

      // Check allowed MIME types: JPG, PNG, WEBP
      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

      if (!allowedMimes.includes(file.type) && !allowedExtensions.test(file.name)) {
        return NextResponse.json(
          { error: "Invalid file format. Please upload PNG, JPG, JPEG, or WEBP only." },
          { status: 400 }
        );
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 1. Try uploading to Cloudinary cloud storage first
      try {
        const cloudUpload = await uploadToCloudinary(buffer, `build_clothing/products/${type}`);
        if (cloudUpload.success && cloudUpload.url) {
          return NextResponse.json({ success: true, url: cloudUpload.url, fileName: file.name });
        }
      } catch (cloudErr) {
        console.warn("[UPLOAD] Cloudinary attempt skipped or failed:", cloudErr);
      }

      // 2. Try saving to local disk if writable
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase()
        .replace(/\.[^/.]+$/, "");
      const fileName = `${type}_${Date.now()}_${sanitizedName}.${ext}`;

      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        const fileUrl = `/uploads/products/${fileName}`;
        return NextResponse.json({ success: true, url: fileUrl, fileName });
      } catch (fsError: any) {
        // 3. Fallback for serverless read-only filesystems (like Vercel /var/task)
        console.warn("[UPLOAD] Local filesystem is read-only (EROFS). Falling back to Base64 data URI.");
        const mime = file.type || "image/jpeg";
        const base64Url = `data:${mime};base64,${buffer.toString("base64")}`;
        return NextResponse.json({ success: true, url: base64Url, fileName });
      }
    }

    // Handle Base64 direct file uploads
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { base64, type = "product" } = body;

      if (!base64) {
        return NextResponse.json(
          { error: "Direct file upload required. External URLs are not accepted." },
          { status: 400 }
        );
      }

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: "Invalid image data." }, { status: 400 });
      }

      const mime = matches[1];
      const data = matches[2];
      const ext = mime.split("/")[1] || "jpg";

      // 1. Try uploading to Cloudinary
      try {
        const cloudUpload = await uploadToCloudinary(base64, `build_clothing/products/${type}`);
        if (cloudUpload.success && cloudUpload.url) {
          return NextResponse.json({ success: true, url: cloudUpload.url });
        }
      } catch (cloudErr) {
        console.warn("[UPLOAD] Cloudinary base64 attempt failed:", cloudErr);
      }

      // 2. Try local disk
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${type}_${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, Buffer.from(data, "base64"));
        return NextResponse.json({ success: true, url: `/uploads/products/${fileName}` });
      } catch (fsError) {
        // 3. Fallback: return data URI directly
        return NextResponse.json({ success: true, url: base64 });
      }
    }

    return NextResponse.json({ error: "Unsupported request format. Please upload a file." }, { status: 400 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to process upload" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (fileUrl && fileUrl.startsWith("/uploads/products/")) {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", "products", fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
