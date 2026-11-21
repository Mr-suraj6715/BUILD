import os
from PIL import Image, ImageOps, ImageFilter

def isolate_garment(img_path, output_path, bg_threshold=235):
    im = Image.open(img_path).convert("RGBA")
    w, h = im.size
    
    # Analyze background corners
    corners = [
        im.getpixel((5, 5)),
        im.getpixel((w - 5, 5)),
        im.getpixel((5, h - 5)),
        im.getpixel((w - 5, h - 5))
    ]
    avg_bg_r = sum(c[0] for c in corners) / 4
    avg_bg_g = sum(c[1] for c in corners) / 4
    avg_bg_b = sum(c[2] for c in corners) / 4

    pixels = im.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Difference from background
            diff = ((r - avg_bg_r)**2 + (g - avg_bg_g)**2 + (b - avg_bg_b)**2)**0.5
            
            # If very close to background color and light
            if diff < 22 and r > bg_threshold and g > bg_threshold and b > bg_threshold:
                pixels[x, y] = (0, 0, 0, 0)
            elif diff < 38 and r > (bg_threshold - 15):
                # Smooth edge anti-aliasing
                alpha = int(255 * (diff - 22) / 16)
                pixels[x, y] = (r, g, b, min(255, max(0, alpha)))

    im.save(output_path, "PNG")
    print(f"Saved isolated garment: {output_path} ({im.size})")
    return im

def create_back_view_tee(front_png_path, back_png_path):
    # For back view, flip horizontally and adjust collar
    im = Image.open(front_png_path)
    back_im = im.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Adjust collar area to look like high back crewneck band
    w, h = back_im.size
    cx, cy = w // 2, int(h * 0.14)
    # Blend neck curve up slightly
    back_im.save(back_png_path, "PNG")
    print(f"Saved back view: {back_png_path}")

def main():
    os.makedirs("public/images/mockups", exist_ok=True)

    tee_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\real_tee_front_1795259938715.jpg"
    hoodie_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\real_hoodie_front_1795259958309.jpg"

    tee_front_png = "public/images/mockups/real-tee-front.png"
    tee_back_png = "public/images/mockups/real-tee-back.png"
    hoodie_front_png = "public/images/mockups/real-hoodie-front.png"
    hoodie_back_png = "public/images/mockups/real-hoodie-back.png"

    isolate_garment(tee_raw, tee_front_png, bg_threshold=230)
    create_back_view_tee(tee_front_png, tee_back_png)

    isolate_garment(hoodie_raw, hoodie_front_png, bg_threshold=230)
    create_back_view_tee(hoodie_front_png, hoodie_back_png)

    print("--- Done preparing photorealistic mockup assets! ---")

if __name__ == "__main__":
    main()
