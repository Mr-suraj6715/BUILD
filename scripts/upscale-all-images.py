import os
from PIL import Image, ImageEnhance, ImageFilter

def enhance_and_save(img, target_size, save_path):
    # Upscale with Lanczos
    res = img.resize(target_size, Image.Resampling.LANCZOS)
    # Subtle unsharp mask for crisp streetwear fabric definition
    res = res.filter(ImageFilter.UnsharpMask(radius=1.5, percent=125, threshold=2))
    # Slight contrast enhancement (2%)
    enhancer = ImageEnhance.Contrast(res)
    res = enhancer.enhance(1.02)
    res.save(save_path, quality=98, subsampling=0)
    print(f"Enhanced -> {save_path} ({res.size})")

def main():
    print("--- Upscaling All Images to Ultra High-Resolution ---")

    navy_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\.user_uploaded\media_1795258987987_4a4a4591.jpg"
    maroon_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\.user_uploaded\media_1795258987950_6a08b306.jpg"
    beige_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\.user_uploaded\media_1795258987899_404af8e6.jpg"
    master_raw = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\.user_uploaded\media_1795258987968_b6683284.jpg"

    prod_dir = "public/images/products"
    camp_dir = "public/images/campaign"

    # 1. High-Density Campaign Boards (2048 x 1366)
    enhance_and_save(Image.open(navy_raw), (2048, 1366), os.path.join(camp_dir, "build-series-navy.jpg"))
    enhance_and_save(Image.open(maroon_raw), (2048, 1366), os.path.join(camp_dir, "build-series-burgundy.jpg"))
    enhance_and_save(Image.open(beige_raw), (2048, 1366), os.path.join(camp_dir, "build-series-sand.jpg"))
    enhance_and_save(Image.open(master_raw), (2048, 1364), os.path.join(camp_dir, "build-series-flatlay.jpg"))

    # 2. High-Density Artwork Globe (1200 x 640)
    im_navy = Image.open(navy_raw)
    artwork = im_navy.crop((400, 412, 750, 600))
    enhance_and_save(artwork, (1200, 640), os.path.join(camp_dir, "build-artwork.jpg"))

    # 3. High-Density Model & Flatlay Shots (1000 x 1250 model, 1000 x 1000 flatlay)
    colors = [
        ("navy", navy_raw),
        ("burgundy", maroon_raw),
        ("sand", beige_raw)
    ]

    for color_name, src in colors:
        im = Image.open(src)
        
        # Model Front: crop (105, 0, 415, 388) -> upscale to 1000 x 1250
        model_front = im.crop((105, 0, 415, 388))
        enhance_and_save(model_front, (1000, 1250), os.path.join(prod_dir, f"build-model-{color_name}-front.jpg"))

        # Model Back: crop (395, 0, 770, 388) -> upscale to 1200 x 1250
        model_back = im.crop((395, 0, 770, 388))
        enhance_and_save(model_back, (1200, 1250), os.path.join(prod_dir, f"build-model-{color_name}-back.jpg"))

        # Flatlay Front: crop (12, 412, 198, 598) -> upscale to 1000 x 1000
        flat_front = im.crop((12, 412, 198, 598))
        enhance_and_save(flat_front, (1000, 1000), os.path.join(prod_dir, f"build-series-{color_name}-front.jpg"))

        # Flatlay Back: crop (192, 412, 385, 598) -> upscale to 1000 x 1000
        flat_back = im.crop((192, 412, 385, 598))
        enhance_and_save(flat_back, (1000, 1000), os.path.join(prod_dir, f"build-series-{color_name}-back.jpg"))

        # Chest Detail: crop (775, 185, 1024, 345) -> upscale to 800 x 520
        chest = im.crop((775, 185, 1024, 345))
        enhance_and_save(chest, (800, 520), os.path.join(prod_dir, f"build-detail-{color_name}-chest.jpg"))

        # Neck Detail: crop (775, 0, 1024, 185) -> upscale to 800 x 600
        neck = im.crop((775, 0, 1024, 185))
        enhance_and_save(neck, (800, 600), os.path.join(prod_dir, f"build-detail-{color_name}-neck.jpg"))

    print("--- All Images Upscaled Successfully! ---")

if __name__ == "__main__":
    main()
