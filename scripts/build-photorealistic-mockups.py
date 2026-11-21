import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance, ImageChops

def create_fabric_texture():
    tex_path = "public/images/stitch/fabric-texture.jpg"
    if os.path.exists(tex_path):
        tex = Image.open(tex_path).convert("L")
        return tex
    # Fallback procedural texture
    tex = Image.new("L", (800, 800), 200)
    return tex

def draw_stitching(draw, points, color=(140, 140, 140, 160), dash_len=4, space_len=3):
    # Draw dashed stitch line along points
    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i + 1]
        dist = math.hypot(x2 - x1, y2 - y1)
        if dist == 0: continue
        steps = int(dist / (dash_len + space_len))
        dx = (x2 - x1) / dist
        dy = (y2 - y1) / dist
        for s in range(steps):
            sx = x1 + s * (dash_len + space_len) * dx
            sy = y1 + s * (dash_len + space_len) * dy
            ex = sx + dash_len * dx
            ey = sy + dash_len * dy
            draw.line([(sx, sy), (ex, ey)], fill=color, width=1)

def render_garment(garment_type, view, fabric_tex):
    W, H = 800, 800
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mask = Image.new("L", (W, H), 0)
    draw_mask = ImageDraw.Draw(mask)

    # Shading layer for creases and lighting
    shade = Image.new("L", (W, H), 215)
    draw_shade = ImageDraw.Draw(shade)

    # Ambient drop shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_shadow = ImageDraw.Draw(shadow)

    # Coordinates calibrated for 800x800 square
    # Center is at x = 400
    if garment_type == "oversized":
        # Boxy Streetwear Silhouette: Dropped shoulder, wider body, longer sleeve
        collar_l = (320, 120)
        collar_r = (480, 120)
        shoulder_l = (180, 195)
        shoulder_r = (620, 195)
        sleeve_outer_l = (130, 360)
        sleeve_inner_l = (220, 385)
        armpit_l = (260, 290)
        waist_l = (265, 680)
        waist_r = (535, 680)
        armpit_r = (540, 290)
        sleeve_inner_r = (580, 385)
        sleeve_outer_r = (670, 360)

        if view == "front":
            neck_ctrl = (400, 175)
            back_neck_ctrl = (400, 130)
        else:
            neck_ctrl = (400, 135)
            back_neck_ctrl = (400, 130)

        # Polygon outline
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 685), waist_r, armpit_r, sleeve_inner_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "half-sleeve":
        # Relaxed Everyday Cut
        collar_l = (330, 125)
        collar_r = (470, 125)
        shoulder_l = (210, 180)
        shoulder_r = (590, 180)
        sleeve_outer_l = (160, 330)
        sleeve_inner_l = (240, 350)
        armpit_l = (275, 275)
        waist_l = (280, 675)
        waist_r = (520, 675)
        armpit_r = (525, 275)
        sleeve_inner_r = (560, 350)
        sleeve_outer_r = (640, 330)

        neck_ctrl = (400, 170) if view == "front" else (400, 135)
        back_neck_ctrl = (400, 130)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 678), waist_r, armpit_r, sleeve_inner_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "regular-fit":
        # Classic Tailored Fit: Set-in shoulder, standard mid-bicep sleeve
        collar_l = (335, 125)
        collar_r = (465, 125)
        shoulder_l = (230, 175)
        shoulder_r = (570, 175)
        sleeve_outer_l = (195, 290)
        sleeve_inner_l = (260, 305)
        armpit_l = (285, 260)
        waist_l = (295, 670)
        waist_r = (505, 670)
        armpit_r = (515, 260)
        sleeve_inner_r = (540, 305)
        sleeve_outer_r = (605, 290)

        neck_ctrl = (400, 165) if view == "front" else (400, 135)
        back_neck_ctrl = (400, 130)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 672), waist_r, armpit_r, sleeve_inner_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "full-sleeve":
        # Long Sleeves down to wrist cuffs
        collar_l = (330, 125)
        collar_r = (470, 125)
        shoulder_l = (220, 180)
        shoulder_r = (580, 180)
        sleeve_outer_l = (125, 460)
        sleeve_cuff_l = (165, 485)
        sleeve_inner_l = (220, 400)
        armpit_l = (280, 275)
        waist_l = (285, 675)
        waist_r = (515, 675)
        armpit_r = (520, 275)
        sleeve_inner_r = (580, 400)
        sleeve_cuff_r = (635, 485)
        sleeve_outer_r = (675, 460)

        neck_ctrl = (400, 168) if view == "front" else (400, 135)
        back_neck_ctrl = (400, 130)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_cuff_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 678), waist_r, armpit_r, sleeve_inner_r, sleeve_cuff_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "polo":
        # Structured Polo Collar with 2-Button Placket
        collar_l = (325, 125)
        collar_r = (475, 125)
        shoulder_l = (220, 180)
        shoulder_r = (580, 180)
        sleeve_outer_l = (180, 310)
        sleeve_inner_l = (250, 325)
        armpit_l = (280, 270)
        waist_l = (290, 675)
        waist_r = (510, 675)
        armpit_r = (520, 270)
        sleeve_inner_r = (550, 325)
        sleeve_outer_r = (620, 310)

        neck_ctrl = (400, 150) if view == "front" else (400, 135)
        back_neck_ctrl = (400, 130)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 675), waist_r, armpit_r, sleeve_inner_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "hoodie":
        # Heavyweight Streetwear Hoodie with Hood & Kangaroo Pouch
        hood_top = (400, 50)
        hood_l = (280, 110)
        hood_r = (520, 110)
        collar_l = (310, 140)
        collar_r = (490, 140)
        shoulder_l = (180, 195)
        shoulder_r = (620, 195)
        sleeve_outer_l = (130, 440)
        sleeve_cuff_l = (175, 465)
        sleeve_inner_l = (225, 385)
        armpit_l = (265, 290)
        waist_l = (270, 680)
        waist_r = (530, 680)
        armpit_r = (535, 290)
        sleeve_inner_r = (575, 385)
        sleeve_cuff_r = (625, 465)
        sleeve_outer_r = (670, 440)

        neck_ctrl = (400, 165) if view == "front" else (400, 130)
        back_neck_ctrl = (400, 125)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_cuff_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 682), waist_r, armpit_r, sleeve_inner_r, sleeve_cuff_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    elif garment_type == "sweatshirt":
        # Crewneck Sweatshirt with V-Stitch & Ribbed Trims
        collar_l = (325, 125)
        collar_r = (475, 125)
        shoulder_l = (200, 185)
        shoulder_r = (600, 185)
        sleeve_outer_l = (130, 440)
        sleeve_cuff_l = (175, 465)
        sleeve_inner_l = (225, 385)
        armpit_l = (270, 285)
        waist_l = (275, 680)
        waist_r = (525, 680)
        armpit_r = (530, 285)
        sleeve_inner_r = (575, 385)
        sleeve_cuff_r = (625, 465)
        sleeve_outer_r = (670, 440)

        neck_ctrl = (400, 165) if view == "front" else (400, 135)
        back_neck_ctrl = (400, 130)
        body_poly = [
            collar_l, shoulder_l, sleeve_outer_l, sleeve_cuff_l, sleeve_inner_l, armpit_l,
            waist_l, (400, 682), waist_r, armpit_r, sleeve_inner_r, sleeve_cuff_r, sleeve_outer_r,
            shoulder_r, collar_r
        ]

    # 1. Fill base mask
    draw_mask.polygon(body_poly, fill=255)

    # For hood on hoodie, add hood structure to mask
    if garment_type == "hoodie":
        if view == "front":
            draw_mask.polygon([(300, 140), (275, 90), (330, 50), (400, 45), (470, 50), (525, 90), (500, 140)], fill=255)
        else:
            # Back view: hood resting on upper back
            draw_mask.polygon([(300, 130), (280, 80), (340, 45), (400, 40), (460, 45), (520, 80), (500, 130)], fill=255)

    # Soften outline mask edges for photographic anti-aliasing
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))

    # 2. Render Photorealistic Shading (Wrinkles, Folds, Depth)
    # Natural body gradient: lighter center chest, darker lateral edges
    for r in range(250, 0, -5):
        alpha_val = int(220 + (250 - r) * 0.12)
        draw_shade.ellipse([400 - r, 340 - int(r*0.8), 400 + r, 340 + int(r*0.8)], fill=min(242, alpha_val))

    # Lateral body shadows (drop shadow on sides)
    draw_shade.line([(body_poly[4][0], body_poly[4][1]), (body_poly[5][0], body_poly[5][1])], fill=175, width=16)
    draw_shade.line([(body_poly[8][0], body_poly[8][1]), (body_poly[7][0], body_poly[7][1])], fill=175, width=16)

    # Under-arm shadows
    draw_shade.line([(body_poly[4][0]-10, body_poly[4][1]-20), (body_poly[4][0]+15, body_poly[4][1]+30)], fill=160, width=12)
    draw_shade.line([(body_poly[8][0]+10, body_poly[8][1]-20), (body_poly[8][0]-15, body_poly[8][1]+30)], fill=160, width=12)

    # Soft natural fabric folds across chest & torso
    draw_shade.arc([300, 310, 500, 350], 0, 180, fill=195, width=6)
    draw_shade.arc([310, 430, 490, 470], 0, 180, fill=195, width=5)
    draw_shade.arc([320, 550, 480, 580], 0, 180, fill=190, width=6)

    # Sleeve drape folds
    draw_shade.line([(body_poly[1][0], body_poly[1][1]), (body_poly[3][0], body_poly[3][1])], fill=180, width=8)
    draw_shade.line([(body_poly[11][0], body_poly[11][1]), (body_poly[9][0], body_poly[9][1])], fill=180, width=8)

    # Bottom hem shadow & rib line
    draw_shade.line([(body_poly[5][0], body_poly[5][1]), (body_poly[7][0], body_poly[7][1])], fill=165, width=6)

    # Collar detail & depth
    if view == "front":
        # Front scoop shadow
        draw_shade.arc([collar_l[0], collar_l[1]-20, collar_r[0], collar_l[1]+75], 0, 180, fill=150, width=8)
        draw_shade.arc([collar_l[0], collar_l[1]-15, collar_r[0], collar_l[1]+65], 0, 180, fill=180, width=4)
        # Inner collar back fabric
        draw_shade.chord([collar_l[0], collar_l[1]-10, collar_r[0], collar_l[1]+60], 0, 180, fill=160)
    else:
        # Back high neck band
        draw_shade.arc([collar_l[0], collar_l[1]-10, collar_r[0], collar_l[1]+40], 0, 180, fill=165, width=7)

    # Specific features for Polo, Hoodie, Sweatshirt
    if garment_type == "polo" and view == "front":
        # Folded collar wings
        draw_shade.polygon([(325, 125), (375, 205), (400, 160), (370, 125)], fill=235)
        draw_shade.polygon([(475, 125), (425, 205), (400, 160), (430, 125)], fill=230)
        draw_shade.line([(325, 125), (375, 205), (400, 160)], fill=140, width=3)
        draw_shade.line([(475, 125), (425, 205), (400, 160)], fill=140, width=3)
        # Placket
        draw_shade.rectangle([390, 160, 410, 270], fill=220, outline=150, width=2)
        # Buttons
        draw_shade.ellipse([396, 185, 404, 193], fill=255, outline=140, width=1)
        draw_shade.ellipse([396, 230, 404, 238], fill=255, outline=140, width=1)

    elif garment_type == "hoodie":
        if view == "front":
            # Hood Cowl Structure
            draw_shade.arc([280, 50, 520, 170], 20, 160, fill=135, width=10)
            draw_shade.chord([330, 70, 470, 165], 10, 170, fill=140)
            # Kangaroo pocket
            draw_shade.polygon([(300, 470), (500, 470), (530, 600), (270, 600)], fill=225, outline=160, width=3)
            # Pocket entry shadows
            draw_shade.line([(300, 470), (270, 600)], fill=150, width=5)
            draw_shade.line([(500, 470), (530, 600)], fill=150, width=5)
            # Drawstring cords (Plain, elegant)
            draw_shade.line([(370, 160), (365, 290)], fill=245, width=4)
            draw_shade.line([(370, 160), (365, 290)], fill=180, width=1)
            draw_shade.rectangle([363, 290, 367, 305], fill=150) # Aglet
            draw_shade.line([(430, 160), (435, 290)], fill=245, width=4)
            draw_shade.line([(430, 160), (435, 290)], fill=180, width=1)
            draw_shade.rectangle([433, 290, 437, 305], fill=150) # Aglet
        else:
            # Hood resting on back
            draw_shade.arc([290, 45, 510, 210], 0, 180, fill=140, width=10)
            draw_shade.chord([310, 60, 490, 200], 0, 180, fill=170)

    elif garment_type == "sweatshirt" and view == "front":
        # Triangular athletic V-notch
        draw_shade.polygon([(385, 165), (400, 195), (415, 165)], fill=200, outline=150, width=2)
        # Raglan shoulder lines
        draw_shade.line([(340, 140), (270, 285)], fill=160, width=3)
        draw_shade.line([(460, 140), (530, 285)], fill=160, width=3)

    # Smooth the shading with slight gaussian blur for photorealistic softness
    shade = shade.filter(ImageFilter.GaussianBlur(3.5))

    # Blend real cotton fabric micro-texture
    tex_resized = fabric_tex.resize((W, H), Image.Resampling.LANCZOS)
    tex_contrast = ImageEnhance.Contrast(tex_resized).enhance(0.4)
    # Composite shading + fabric grain
    combined_l = ImageChops.multiply(shade, tex_contrast)

    # Convert to pure RGB off-white neutral garment
    final_rgb = Image.merge("RGB", (combined_l, combined_l, combined_l))
    # Apply anti-aliased garment mask as alpha
    final_rgba = final_rgb.convert("RGBA")
    final_rgba.putalpha(mask)

    # Draw refined stitching lines onto final image
    draw_final = ImageDraw.Draw(final_rgba)
    stitch_col = (130, 130, 130, 140)
    # Hem stitching
    draw_stitching(draw_final, [(waist_l[0]+15, waist_l[1]-15), (waist_r[0]-15, waist_r[1]-15)], stitch_col)
    # Sleeve hem stitching
    draw_stitching(draw_final, [(sleeve_outer_l[0]+8, sleeve_outer_l[1]-8), (sleeve_inner_l[0]-8, sleeve_inner_l[1]-8)], stitch_col)
    draw_stitching(draw_final, [(sleeve_outer_r[0]-8, sleeve_outer_r[1]-8), (sleeve_inner_r[0]+8, sleeve_inner_r[1]+8)], stitch_col)

    # Shoulder seam stitching
    draw_stitching(draw_final, [collar_l, shoulder_l], stitch_col)
    draw_stitching(draw_final, [collar_r, shoulder_r], stitch_col)

    return final_rgba

def main():
    out_dir = "public/images/mockups"
    os.makedirs(out_dir, exist_ok=True)
    fabric_tex = create_fabric_texture()

    garments = [
        "half-sleeve",
        "full-sleeve",
        "oversized",
        "regular-fit",
        "polo",
        "hoodie",
        "sweatshirt"
    ]

    for g in garments:
        for view in ["front", "back"]:
            img = render_garment(g, view, fabric_tex)
            filename = f"mockup-{g}-{view}.png"
            path = os.path.join(out_dir, filename)
            img.save(path, "PNG", optimize=True)
            print(f"Generated clean photorealistic studio mockup: {filename} ({img.size})")

    print("--- Successfully generated all 14 garment studio mockups! ---")

if __name__ == "__main__":
    main()
