import os
from PIL import Image

def process():
    print("--- Processing New BUILD Series Images ---")
    
    beige_raw = "C:/Users/Suraj Yadav/.gemini/antigravity/brain/e1f52910-a517-4ed6-bcaa-42943466ec1c/.user_uploaded/media_1795258987899_404af8e6.jpg"
    maroon_raw = "C:/Users/Suraj Yadav/.gemini/antigravity/brain/e1f52910-a517-4ed6-bcaa-42943466ec1c/.user_uploaded/media_1795258987950_6a08b306.jpg"
    master_raw = "C:/Users/Suraj Yadav/.gemini/antigravity/brain/e1f52910-a517-4ed6-bcaa-42943466ec1c/.user_uploaded/media_1795258987968_b6683284.jpg"
    navy_raw = "C:/Users/Suraj Yadav/.gemini/antigravity/brain/e1f52910-a517-4ed6-bcaa-42943466ec1c/.user_uploaded/media_1795258987987_4a4a4591.jpg"

    prod_dir = "public/images/products"
    camp_dir = "public/images/campaign"
    os.makedirs(prod_dir, exist_ok=True)
    os.makedirs(camp_dir, exist_ok=True)

    # 1. Save Full Campaign Boards
    Image.open(beige_raw).save(os.path.join(camp_dir, "build-series-sand.jpg"), quality=95)
    Image.open(maroon_raw).save(os.path.join(camp_dir, "build-series-burgundy.jpg"), quality=95)
    Image.open(navy_raw).save(os.path.join(camp_dir, "build-series-navy.jpg"), quality=95)
    Image.open(master_raw).save(os.path.join(camp_dir, "build-series-flatlay.jpg"), quality=95)
    print("Saved 4 campaign boards to public/images/campaign/")

    # 2. Extract crops for each color
    color_map = [
        ("sand", beige_raw),
        ("burgundy", maroon_raw),
        ("navy", navy_raw)
    ]

    for color_name, src_path in color_map:
        im = Image.open(src_path)
        w, h = im.size

        # Model Front: x 105 to 415, y 0 to 388
        model_front = im.crop((105, 0, 415, 388))
        model_front_path = os.path.join(prod_dir, f"build-model-{color_name}-front.jpg")
        model_front.save(model_front_path, quality=95)

        # Model Back: x 395 to 770, y 0 to 388
        model_back = im.crop((395, 0, 770, 388))
        model_back_path = os.path.join(prod_dir, f"build-model-{color_name}-back.jpg")
        model_back.save(model_back_path, quality=95)

        # Flatlay Front: x 12 to 198, y 412 to 598
        flat_front = im.crop((12, 412, 198, 598))
        flat_front_path = os.path.join(prod_dir, f"build-series-{color_name}-front.jpg")
        flat_front.save(flat_front_path, quality=95)

        # Flatlay Back: x 192 to 385, y 412 to 598
        flat_back = im.crop((192, 412, 385, 598))
        flat_back_path = os.path.join(prod_dir, f"build-series-{color_name}-back.jpg")
        flat_back.save(flat_back_path, quality=95)

        # Detail: Front chest print hit: x 775 to 1024, y 185 to 345
        chest_detail = im.crop((775, 185, 1024, 345))
        chest_detail.save(os.path.join(prod_dir, f"build-detail-{color_name}-chest.jpg"), quality=95)

        # Detail: Neck label hit: x 775 to 1024, y 0 to 185
        neck_detail = im.crop((775, 0, 1024, 185))
        neck_detail.save(os.path.join(prod_dir, f"build-detail-{color_name}-neck.jpg"), quality=95)

        print(f"Generated product images for {color_name}:")
        print(f"  - Model Front: {model_front.size}")
        print(f"  - Model Back: {model_back.size}")
        print(f"  - Flat Front: {flat_front.size}")
        print(f"  - Flat Back: {flat_back.size}")

    # Extract Back Architectural Artwork Globe from master or navy board
    im_navy = Image.open(navy_raw)
    artwork_crop = im_navy.crop((400, 412, 750, 600))
    artwork_crop.save(os.path.join(camp_dir, "build-artwork.jpg"), quality=95)
    print("Saved build-artwork.jpg to campaign/")

    print("--- Finished Image Processing Successfully! ---")

if __name__ == "__main__":
    process()
