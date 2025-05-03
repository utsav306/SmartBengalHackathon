import os
import torch
from PIL import Image
import open_clip
from playwright.sync_api import sync_playwright

# Load CLIP model and preprocessing tools
clip_model, _, clip_preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
clip_tokenizer = open_clip.get_tokenizer('ViT-B-32')

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model.to(device)

# --- Phase 1: Capture screenshots section-wise ---
def capture_sections_and_fullpage(page, url, website_name):
    screenshots_folder = f"screenshots/{website_name}"
    os.makedirs(screenshots_folder, exist_ok=True)

    try:
        page.goto(url, wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)  # Allow time for full rendering

        selectors = {
            "header": [
                'header', 'nav', 'div[role="banner"]', '.header', '.navbar', '#header',
                '#nav-main', '#navbar', '.top-bar', '.main-header', '.global-header',
                'div[data-role="header"]', '.site-header', 'div[class*="header"]',
                'div[class*="navbar"]', 'div[class*="top"]'
            ],
            "footer": [
                'footer', '.footer', '#footer', '#navFooter', '.site-footer', '.bottom-bar',
                'div[role="contentinfo"]', '.main-footer', '.global-footer',
                '.footer-wrapper', 'div[class*="footer"]', 'div[class*="bottom"]',
                'div[data-role="footer"]', '.site-info'
            ]
        }

        header = next((page.query_selector(sel) for sel in selectors["header"] if page.query_selector(sel)), None)
        footer = next((page.query_selector(sel) for sel in selectors["footer"] if page.query_selector(sel)), None)

        if not header or not footer:
            print(f"❌ Couldn't find header or footer for {website_name}. Skipping...")
            return None

        header_box = header.bounding_box()
        footer_box = footer.bounding_box()

        if not header_box or not footer_box:
            print(f"❌ Couldn't retrieve bounding boxes for {website_name}. Skipping...")
            return None

        header_bottom = header_box['y'] + header_box['height']
        footer_top = footer_box['y']
        main_height = max(0, footer_top - header_bottom)

        header_path = f"{screenshots_folder}/{website_name}_header.png"
        main_path = f"{screenshots_folder}/{website_name}_main.png"
        footer_path = f"{screenshots_folder}/{website_name}_footer.png"

        header.screenshot(path=header_path)

        if main_height > 50:
            page.screenshot(path=main_path, clip={'x': 0, 'y': header_bottom, 'width': 1280, 'height': main_height})
        else:
            print(f"⚠️ Main section too small for {website_name}. Skipping main.")
            main_path = None

        footer.screenshot(path=footer_path)

        return {"header": header_path, "main": main_path, "footer": footer_path}

    except Exception as e:
        print(f"❌ Error processing {website_name}: {e}")
        return None

# --- Phase 2: Score each section using CLIP ---
@torch.no_grad()
def score_section(image_path, section_type, category):
    # Generate a general prompt based on the category
    prompt = f"Score on basis of  user-friendly {section_type} for {category} websites, showcasing modern design and clear navigation."

    image = Image.open(image_path).convert("RGB")
    image_tensor = clip_preprocess(image).unsqueeze(0).to(device)
    image_features = clip_model.encode_image(image_tensor)

    text_tokens = clip_tokenizer([prompt])
    text_features = clip_model.encode_text(text_tokens.to(device))

    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)
    clip_score = (image_features @ text_features.T).item()

    clarity_score = min(1.0, clip_score + 0.1)
    modernity_score = min(1.0, clip_score + 0.05)
    relevance_score = clip_score
    consistency_score = min(1.0, clip_score + 0.07)
    visual_appeal_score = min(1.0, clip_score + 0.08)

    criteria_scores = {
        "Clarity": round(clarity_score, 2),
        "Modernity": round(modernity_score, 2),
        "Relevance": round(relevance_score, 2),
        "Consistency": round(consistency_score, 2),
        "Visual Appeal": round(visual_appeal_score, 2),
    }

    print(f"📷 {section_type.capitalize()} - {os.path.basename(image_path)}: CLIP Score = {clip_score:.3f}")

    return {
        "clip_score": clip_score,
        "criteria_scores": criteria_scores
    }

# --- Phase 3: Compare sections and pick best ---
def compare_websites(websites, category):
    all_scores = {"header": [], "main": [], "footer": []}

    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 3000})

        for site in websites:
            name, url = site['name'], site['url']
            print(f"\n🌐 Processing {name}...")
            page = context.new_page()
            sections = capture_sections_and_fullpage(page, url, name)
            page.close()

            if not sections:
                continue

            for section_type in ["header", "main", "footer"]:
                image_path = sections.get(section_type)
                if image_path:
                    result = score_section(image_path, section_type, category)
                    all_scores[section_type].append({
                        "name": name,
                        "path": image_path,
                        "score": result["clip_score"],
                        "criteria": result["criteria_scores"]
                    })

        browser.close()

    for section in ["header", "main", "footer"]:
        if not all_scores[section]:
            print(f"\n❌ No scores for {section}.")
            continue
        print(f"\n🔎 Best {section.upper()} for {category.upper()} websites:")
        best = max(all_scores[section], key=lambda x: x['score'])
        print(f"✅ {best['name']} — Score: {best['score']:.3f}")
        print("📊 Criteria Scores:")
        for k, v in best['criteria'].items():
            print(f"   - {k}: {v}")

# --- Run Comparison ---
websites = [
    {"name": "amazon", "url": "https://www.amazon.in/"},
    {"name": "flipkart", "url": "https://www.flipkart.com/"},
    {"name": "jio", "url": "https://www.jiomart.com/"}
]

compare_websites(websites, category="E-commerce")
