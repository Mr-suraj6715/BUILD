import crypto from "crypto";

export async function uploadToCloudinary(
  fileBase64OrBuffer: string | Buffer,
  folder: string = "build_clothing/products"
): Promise<{ success: boolean; url: string; error?: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { success: false, url: "", error: "Cloudinary credentials not configured" };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signature requires parameters sorted alphabetically: folder, timestamp
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const formData = new FormData();
    const fileData =
      typeof fileBase64OrBuffer === "string"
        ? fileBase64OrBuffer
        : `data:image/png;base64,${fileBase64OrBuffer.toString("base64")}`;

    formData.append("file", fileData);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.toLowerCase()}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.secure_url) {
      console.log(`[CLOUDINARY UPLOAD SUCCESS] Uploaded to: ${data.secure_url}`);
      return { success: true, url: data.secure_url };
    } else {
      console.warn(`[CLOUDINARY UPLOAD WARN] Status: ${res.status}`, data);
      return {
        success: false,
        url: "",
        error: data?.error?.message || "Cloudinary rejected the upload",
      };
    }
  } catch (err: any) {
    console.error("[CLOUDINARY UPLOAD EXCEPTION]", err?.message || err);
    return { success: false, url: "", error: err?.message || "Cloudinary network error" };
  }
}
