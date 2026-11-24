import os
from PIL import Image
import rembg

def process_image(src_path, front_out_names, back_out_names, session):
    out_dir = "public/images/mockups"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\n--- Loading {os.path.basename(src_path)} ---")
    im = Image.open(src_path).convert("RGB")
    W, H = im.size
    
    # Left half is Front, Right half is Back
    front_crop = im.crop((0, 0, W // 2, H))
    back_crop = im.crop((W // 2, 0, W, H))
    
    print(f"Removing background from Front with u2netp...")
    front_nobg = rembg.remove(front_crop, session=session)
    
    print(f"Removing background from Back with u2netp...")
    back_nobg = rembg.remove(back_crop, session=session)
    
    # Normalize and center each onto an 800x800 transparent square canvas
    for is_front, (nobg, out_names) in enumerate([(front_nobg, front_out_names), (back_nobg, back_out_names)]):
        bbox = nobg.getbbox()
        if bbox:
            cropped = nobg.crop(bbox)
        else:
            cropped = nobg
            
        target_size = 800
        max_dim = 680
        scale = min(max_dim / cropped.width, max_dim / cropped.height)
        new_w = int(cropped.width * scale)
        new_h = int(cropped.height * scale)
        scaled = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        offset_x = (target_size - new_w) // 2
        offset_y = (target_size - new_h) // 2 - 15
        canvas.paste(scaled, (offset_x, offset_y), scaled)
        
        for name in out_names:
            out_path = os.path.join(out_dir, name)
            canvas.save(out_path, "PNG", optimize=True)
            print(f"  -> Generated: {name} ({canvas.size})")

def main():
    base_dir = r"C:\Users\Suraj Yadav\.gemini\antigravity\brain\e1f52910-a517-4ed6-bcaa-42943466ec1c\.user_uploaded"
    print("Initializing rembg u2netp session...")
    session = rembg.new_session("u2netp")
    
    # 1. Half Sleeve T-Shirt
    half_sleeve_src = os.path.join(base_dir, "media_1795496383034_59e9066a.jpg")
    if not os.path.exists(half_sleeve_src):
        half_sleeve_src = os.path.join(base_dir, "media_1795284214912_e03f8b52.jpg")
    process_image(
        half_sleeve_src,
        front_out_names=["mockup-half-sleeve-front.png"],
        back_out_names=["mockup-half-sleeve-back.png"],
        session=session
    )

    # 2. Regular Fit T-Shirt
    regular_fit_src = os.path.join(base_dir, "media_1795498711341_023ca673.jpg")
    process_image(
        regular_fit_src,
        front_out_names=["mockup-regular-fit-front.png"],
        back_out_names=["mockup-regular-fit-back.png"],
        session=session
    )

    # 3. Oversized T-Shirt
    oversized_src = os.path.join(base_dir, "media_1795498711354_77f1647a.jpg")
    process_image(
        oversized_src,
        front_out_names=["mockup-oversized-front.png"],
        back_out_names=["mockup-oversized-back.png"],
        session=session
    )

    # 4. Crewneck Sweatshirt
    sweatshirt_src = os.path.join(base_dir, "media_1795498711360_ada7b038.jpg")
    process_image(
        sweatshirt_src,
        front_out_names=["mockup-sweatshirt-front.png"],
        back_out_names=["mockup-sweatshirt-back.png"],
        session=session
    )

    # 5. Polo T-Shirt
    polo_src = os.path.join(base_dir, "media_1795498711279_3ec3852a.jpg")
    process_image(
        polo_src,
        front_out_names=["mockup-polo-front.png"],
        back_out_names=["mockup-polo-back.png"],
        session=session
    )
    
    # 6. Full Sleeve T-Shirt
    full_sleeve_src = os.path.join(base_dir, "media_1795496383002_d305bbb1.jpg")
    if not os.path.exists(full_sleeve_src):
        full_sleeve_src = os.path.join(base_dir, "media_1795284214896_672e14bd.jpg")
    process_image(
        full_sleeve_src,
        front_out_names=["mockup-full-sleeve-front.png"],
        back_out_names=["mockup-full-sleeve-back.png"],
        session=session
    )
    
    # 7. Heavyweight Hoodie
    hoodie_src = os.path.join(base_dir, "media_1795496382987_db3373a9.jpg")
    if not os.path.exists(hoodie_src):
        hoodie_src = os.path.join(base_dir, "media_1795284214909_a927628c.jpg")
    process_image(
        hoodie_src,
        front_out_names=["mockup-hoodie-front.png"],
        back_out_names=["mockup-hoodie-back.png"],
        session=session
    )
    
    print("\n--- All 7 garments (14 mockups) generated with their own individual real studio photos! ---")

if __name__ == "__main__":
    main()
