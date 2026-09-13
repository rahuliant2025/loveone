"""
Generate high-resolution royal WhatsApp wedding invitation cards for Rahul & Shristi.
Generates:
1. whatsapp_invite_card.png (1080x1350 - perfect WhatsApp chat card)
2. whatsapp_invite_story.png (1080x1920 - WhatsApp Status / Story)
3. og_preview.png (1200x630 - WhatsApp Link preview thumbnail)
"""

import math
from PIL import Image, ImageDraw, ImageFont

def get_font(name, size, is_bold=False):
    font_paths = [
        f"C:/Windows/Fonts/{name}.ttf",
        f"C:/Windows/Fonts/{name.upper()}.TTF",
        f"C:/Windows/Fonts/{name.capitalize()}.ttf",
        "C:/Windows/Fonts/NIRMALAB.TTF" if is_bold else "C:/Windows/Fonts/NIRMALA.TTF",
        "C:/Windows/Fonts/cambriab.ttf" if is_bold else "C:/Windows/Fonts/cambria.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if is_bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for p in font_paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

def draw_diamond(draw, cx, cy, size=6, color=(220, 180, 105)):
    points = [(cx, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)]
    draw.polygon(points, fill=color)

def draw_ornate_border(draw, width, height, margin=40, gold_color=(220, 180, 105)):
    # Outer thin border
    draw.rectangle([margin, margin, width - margin, height - margin], outline=gold_color, width=2)
    # Inner thicker border
    draw.rectangle([margin + 12, margin + 12, width - margin - 12, height - margin - 12], outline=gold_color, width=4)
    # Third thin inner border
    draw.rectangle([margin + 20, margin + 20, width - margin - 20, height - margin - 20], outline=gold_color, width=1)

    # Corner ornaments
    corner_size = 40
    corners = [
        (margin + 20, margin + 20),
        (width - margin - 20, margin + 20),
        (margin + 20, height - margin - 20),
        (width - margin - 20, height - margin - 20)
    ]
    for cx, cy in corners:
        draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=gold_color)

def draw_dhamma_wheel(draw, center_x, center_y, radius=32, color=(220, 180, 105)):
    # Outer rim
    draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], outline=color, width=3)
    draw.ellipse([center_x - (radius - 5), center_y - (radius - 5), center_x + (radius - 5), center_y + (radius - 5)], outline=color, width=1)
    # Hub
    hub_r = 8
    draw.ellipse([center_x - hub_r, center_y - hub_r, center_x + hub_r, center_y + hub_r], fill=color)
    # 8 Spokes
    for i in range(8):
        angle = i * (math.pi / 4)
        x2 = center_x + int((radius - 5) * math.cos(angle))
        y2 = center_y + int((radius - 5) * math.sin(angle))
        draw.line([(center_x, center_y), (x2, y2)], fill=color, width=2)

def create_whatsapp_chat_card():
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), (55, 12, 22))
    draw = ImageDraw.Draw(img)

    for r in range(400, 0, -5):
        alpha = int(25 * (1 - r / 400))
        c = (55 + alpha, 12 + int(alpha * 0.4), 22 + int(alpha * 0.6))
        draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=c)

    gold = (226, 188, 114)
    gold_light = (245, 220, 160)
    cream = (252, 243, 230)
    muted = (215, 195, 185)

    draw_ornate_border(draw, W, H, margin=45, gold_color=gold)

    # Top Dhamma Wheel
    draw_dhamma_wheel(draw, W // 2, 110, radius=32, color=gold)

    f_pali = get_font("NIRMALAB", 24, True)
    f_eyebrow = get_font("NIRMALAB", 22, True)
    f_script = get_font("constanb", 32, True)
    f_name = get_font("constanb", 64, True)
    f_and = get_font("georgiai", 38, False)
    f_family = get_font("NIRMALA", 22, False)
    f_title = get_font("constanb", 36, True)
    f_body = get_font("NIRMALA", 21, False)
    f_event_title = get_font("NIRMALAB", 24, True)
    f_small = get_font("NIRMALA", 18, False)

    y = 165
    draw.text((W // 2, y), "॥ बुद्धं शरणं गच्छामि · धम्मं शरणं गच्छामि · संघं शरणं गच्छामि ॥", fill=gold, font=f_pali, anchor="mm")
    
    y += 42
    draw.text((W // 2, y), "— TWO CULTURES · ONE SACRED PROMISE —", fill=gold_light, font=f_eyebrow, anchor="mm")

    y += 35
    draw.text((W // 2, y), "Maharashtrian Buddhist Grace × Bihari Wedding Parampara", fill=muted, font=f_small, anchor="mm")

    y += 50
    draw.line([(W // 2 - 140, y), (W // 2 + 140, y)], fill=gold, width=1)
    draw_diamond(draw, W // 2, y, size=6, color=gold)

    y += 45
    draw.text((W // 2, y), "Together with their families", fill=cream, font=f_script, anchor="mm")

    # GROOM
    y += 65
    draw.text((W // 2, y), "Rahul Patel", fill=gold_light, font=f_name, anchor="mm")
    y += 40
    draw.text((W // 2, y), "Son of Smt. Geeta Patel & Shri Bhojraj Patel", fill=cream, font=f_family, anchor="mm")

    # &
    y += 42
    draw.text((W // 2, y), "&", fill=gold, font=f_and, anchor="mm")

    # BRIDE
    y += 42
    draw.text((W // 2, y), "Shristi Singh", fill=gold_light, font=f_name, anchor="mm")
    y += 40
    draw.text((W // 2, y), "Daughter of Smt. Nirmala Singh & Shri Amin Singh", fill=cream, font=f_family, anchor="mm")

    y += 45
    draw.text((W // 2, y), "cordially invite you to grace their wedding celebrations", fill=muted, font=f_body, anchor="mm")

    # EVENT CARD HIGHLIGHT BOX
    y += 35
    box_w, box_h = 920, 360
    box_x1 = (W - box_w) // 2
    box_y1 = y
    box_x2 = box_x1 + box_w
    box_y2 = box_y1 + box_h

    draw.rectangle([box_x1, box_y1, box_x2, box_y2], fill=(42, 8, 16), outline=gold, width=2)
    draw.rectangle([box_x1 + 6, box_y1 + 6, box_x2 - 6, box_y2 - 6], outline=(150, 110, 60), width=1)

    by = box_y1 + 40
    draw.text((W // 2, by), "MAIN WEDDING DAY · 11 DECEMBER 2026", fill=gold_light, font=f_title, anchor="mm")
    by += 32
    draw.text((W // 2, by), "Friday · Bilaspur, Chhattisgarh", fill=gold, font=f_eyebrow, anchor="mm")

    by += 45
    draw_diamond(draw, box_x1 + 180, by, size=5, color=gold)
    draw.text((W // 2, by), "शुभ विवाह संस्कार (Wedding Ceremony)", fill=cream, font=f_event_title, anchor="mm")
    by += 26
    draw.text((W // 2, by), "09:00 AM onwards  |  Buddh Vihar, Magarpara, Bilaspur", fill=gold_light, font=f_body, anchor="mm")

    by += 48
    draw_diamond(draw, box_x1 + 175, by, size=5, color=gold)
    draw.text((W // 2, by), "स्नेह मिलन व प्रीतिभोज (Grand Reception)", fill=cream, font=f_event_title, anchor="mm")
    by += 26
    draw.text((W // 2, by), "08:00 PM onwards  |  Pallav Bhawan, Bilaspur", fill=gold_light, font=f_body, anchor="mm")

    by += 48
    draw.text((W // 2, by), "Pre-Wedding: Haldi (10 AM) · Mehendi (4 PM) · Sangeet (8 PM) on 10 Dec at Pallav Bhawan", fill=muted, font=f_small, anchor="mm")

    # FOOTER
    y = box_y2 + 45
    draw.text((W // 2, y), "मंगलं बुद्धं · मंगलं धम्मं · मंगलं संघं", fill=gold, font=f_pali, anchor="mm")

    y += 38
    draw.text((W // 2, y), "Venue: Pallav Bhawan, Ring Road 2, Gaurav Path, Bilaspur", fill=cream, font=f_small, anchor="mm")

    y += 30
    draw.text((W // 2, y), "Blessings & Wishes from Patel & Singh Family", fill=gold_light, font=f_family, anchor="mm")

    img.save("whatsapp_invite_card.png", "PNG", quality=95)
    print("Saved whatsapp_invite_card.png")

def create_whatsapp_story_card():
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), (45, 10, 18))
    draw = ImageDraw.Draw(img)

    for r in range(600, 0, -6):
        alpha = int(22 * (1 - r / 600))
        c = (45 + alpha, 10 + int(alpha * 0.4), 18 + int(alpha * 0.5))
        draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=c)

    gold = (226, 188, 114)
    gold_light = (245, 220, 160)
    cream = (252, 243, 230)
    muted = (215, 195, 185)

    draw_ornate_border(draw, W, H, margin=50, gold_color=gold)
    draw_dhamma_wheel(draw, W // 2, 140, radius=38, color=gold)

    f_pali = get_font("NIRMALAB", 26, True)
    f_subpali = get_font("NIRMALA", 20, False)
    f_eyebrow = get_font("NIRMALAB", 22, True)
    f_script = get_font("constanb", 36, True)
    f_name = get_font("constanb", 72, True)
    f_and = get_font("georgiai", 46, False)
    f_family = get_font("NIRMALA", 24, False)
    f_title = get_font("constanb", 38, True)
    f_body = get_font("NIRMALA", 22, False)
    f_event_title = get_font("NIRMALAB", 26, True)
    f_small = get_font("NIRMALA", 20, False)

    y = 210
    draw.text((W // 2, y), "॥ बुद्धं शरणं गच्छामि · धम्मं शरणं गच्छामि · संघं शरणं गच्छामि ॥", fill=gold, font=f_pali, anchor="mm")
    y += 36
    draw.text((W // 2, y), "मंगलं भगवान बुद्धो मंगलं धम्मं संघं च मंगलम्", fill=gold_light, font=f_subpali, anchor="mm")

    y += 55
    draw.text((W // 2, y), "WEDDING INVITATION", fill=gold, font=f_eyebrow, anchor="mm")

    y += 65
    draw.text((W // 2, y), "With the blessings of Almighty & Elders", fill=cream, font=f_script, anchor="mm")

    # GROOM
    y += 90
    draw.text((W // 2, y), "Rahul Patel", fill=gold_light, font=f_name, anchor="mm")
    y += 45
    draw.text((W // 2, y), "Son of Smt. Geeta Patel & Shri Bhojraj Patel", fill=cream, font=f_family, anchor="mm")

    # &
    y += 52
    draw.text((W // 2, y), "&", fill=gold, font=f_and, anchor="mm")

    # BRIDE
    y += 52
    draw.text((W // 2, y), "Shristi Singh", fill=gold_light, font=f_name, anchor="mm")
    y += 45
    draw.text((W // 2, y), "Daughter of Smt. Nirmala Singh & Shri Amin Singh", fill=cream, font=f_family, anchor="mm")

    y += 55
    draw.text((W // 2, y), "invite you to celebrate their union of love & traditions", fill=muted, font=f_body, anchor="mm")

    # ITINERARY SECTION
    y += 60
    events = [
        ("Haldi Ceremony (हल्दी)", "10 Dec 2026 · 10:00 AM", "Pallav Bhawan, Bilaspur"),
        ("Mehendi Ki Raat (मेहंदी)", "10 Dec 2026 · 04:00 PM", "Pallav Bhawan, Bilaspur"),
        ("Sangeet Celebration (संगीत)", "10 Dec 2026 · 08:00 PM", "Pallav Bhawan, Bilaspur"),
        ("Wedding Ceremony (विवाह संस्कार)", "11 Dec 2026 · 09:00 AM", "Buddh Vihar, Magarpara, Bilaspur"),
        ("Grand Reception (प्रीतिभोज)", "11 Dec 2026 · 08:00 PM", "Pallav Bhawan, Bilaspur"),
    ]

    card_w, card_h = 920, 520
    cx1 = (W - card_w) // 2
    cy1 = y
    cx2 = cx1 + card_w
    cy2 = cy1 + card_h
    draw.rectangle([cx1, cy1, cx2, cy2], fill=(32, 6, 12), outline=gold, width=2)
    draw.rectangle([cx1 + 8, cy1 + 8, cx2 - 8, cy2 - 8], outline=(140, 100, 50), width=1)

    ey = cy1 + 45
    draw.text((W // 2, ey), "WEDDING ITINERARY & VENUES", fill=gold_light, font=f_title, anchor="mm")
    ey += 25
    draw.line([(cx1 + 80, ey), (cx2 - 80, ey)], fill=gold, width=1)

    for title, dt, venue in events:
        ey += 48
        draw_diamond(draw, cx1 + 55, ey, size=6, color=gold)
        draw.text((cx1 + 75, ey), title, fill=gold_light, font=f_event_title, anchor="lm")
        draw.text((cx2 - 50, ey), dt, fill=cream, font=f_body, anchor="rm")
        ey += 28
        draw.text((cx1 + 75, ey), f"Location: {venue}", fill=muted, font=f_small, anchor="lm")

    # FOOTER
    y = cy2 + 70
    draw.text((W // 2, y), "Two Cultures · One Heart · A Lifetime of Happiness", fill=gold_light, font=f_script, anchor="mm")
    y += 40
    draw.text((W // 2, y), "Venue: Pallav Bhawan, Ring Road 2, Gaurav Path, Bilaspur (C.G.)", fill=cream, font=f_small, anchor="mm")
    y += 35
    draw.text((W // 2, y), "Your presence and blessings are warmly requested", fill=muted, font=f_small, anchor="mm")
    y += 45
    draw.text((W // 2, y), "Patel & Singh Family", fill=gold, font=f_title, anchor="mm")

    img.save("whatsapp_invite_story.png", "PNG", quality=95)
    print("Saved whatsapp_invite_story.png")

def create_og_preview():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), (45, 10, 18))
    draw = ImageDraw.Draw(img)

    for r in range(450, 0, -5):
        alpha = int(22 * (1 - r / 450))
        c = (45 + alpha, 10 + int(alpha * 0.4), 18 + int(alpha * 0.5))
        draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=c)

    gold = (226, 188, 114)
    gold_light = (245, 220, 160)
    cream = (252, 243, 230)
    muted = (215, 195, 185)

    draw_ornate_border(draw, W, H, margin=30, gold_color=gold)
    draw_dhamma_wheel(draw, W // 2, 85, radius=28, color=gold)

    f_pali = get_font("NIRMALAB", 20, True)
    f_title = get_font("constanb", 58, True)
    f_and = get_font("georgiai", 36, False)
    f_sub = get_font("NIRMALA", 22, False)
    f_date = get_font("constanb", 32, True)

    y = 135
    draw.text((W // 2, y), "॥ बुद्धं शरणं गच्छामि · धम्मं शरणं गच्छामि · संघं शरणं गच्छामि ॥", fill=gold, font=f_pali, anchor="mm")

    y += 45
    draw.text((W // 2, y), "WEDDING INVITATION", fill=gold_light, font=f_pali, anchor="mm")

    y += 65
    draw.text((W // 2 - 160, y), "Rahul Patel", fill=cream, font=f_title, anchor="mm")
    draw.text((W // 2, y), "&", fill=gold, font=f_and, anchor="mm")
    draw.text((W // 2 + 160, y), "Shristi Singh", fill=cream, font=f_title, anchor="mm")

    y += 55
    draw.text((W // 2, y), "A Celebration of Maharashtrian Buddhist Grace & Bihari Tradition", fill=muted, font=f_sub, anchor="mm")

    y += 50
    draw.line([(W // 2 - 180, y), (W // 2 + 180, y)], fill=gold, width=1)
    draw_diamond(draw, W // 2, y, size=6, color=gold)

    y += 45
    draw.text((W // 2, y), "11 DECEMBER 2026 · BILASPUR (CHHATTISGARH)", fill=gold_light, font=f_date, anchor="mm")

    y += 45
    draw.text((W // 2, y), "Buddh Vihar (Ceremony) & Pallav Bhawan (Reception)", fill=cream, font=f_sub, anchor="mm")

    y += 45
    draw.text((W // 2, y), "Tap to open interactive card & RSVP on WhatsApp", fill=gold, font=f_pali, anchor="mm")

    img.save("og_preview.png", "PNG", quality=95)
    print("Saved og_preview.png")

if __name__ == "__main__":
    create_whatsapp_chat_card()
    create_whatsapp_story_card()
    create_og_preview()
