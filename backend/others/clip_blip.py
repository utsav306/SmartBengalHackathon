import os
import torch
import cv2
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from torch.nn.functional import cosine_similarity
from playwright.sync_api import sync_playwright

# Load CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_model.eval()

# --- Section-specific scoring prompts ---
def get_clip_prompt(section_type, category):
    prompts = {
        "header": f"Evaluate the {section_type} section of a {category} website based on visual appeal, creativity, and branding consistency.",
        "main": f"Evaluate the {section_type} section of a {category} website based on design clarity, layout, and visual hierarchy.",
        "footer": f"Evaluate the {section_type} section of a {category} website based on information completeness and accessibility.",
        "full": f"Evaluate the entire {category} website homepage for overall design quality, user experience, and branding consistency."

    }
    return prompts.get(section_type, f"Evaluate the {section_type} section of a {category} website.")


# --- OpenCV Preprocessing ---
# --- OpenCV Preprocessing (without grayscale) ---
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    # Skip grayscale conversion, directly enhance color image
    enhanced_image = cv2.equalizeHist(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY))
    resized_image = cv2.resize(enhanced_image, (1280, 720))
    final_image = cv2.cvtColor(resized_image, cv2.COLOR_GRAY2BGR)
    processed_image_path = image_path.replace(".png", "_processed.png")
    cv2.imwrite(processed_image_path, final_image)
    return processed_image_path


# --- Screenshot sections ---
def capture_sections_and_fullpage(page, url, website_name):
    screenshots_folder = f"screenshots/{website_name}"
    os.makedirs(screenshots_folder, exist_ok=True)

    try:
        page.goto(url, wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)

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
        full_page_path = f"{screenshots_folder}/{website_name}_full.png"
        page.screenshot(path=full_page_path, full_page=True)


        header.screenshot(path=header_path)

        if main_height > 50:
            page.screenshot(path=main_path, clip={'x': 0, 'y': header_bottom, 'width': 1280, 'height': main_height})
        else:
            print(f"⚠️ Main section too small for {website_name}. Skipping main.")
            main_path = None

        footer.screenshot(path=footer_path)

        return {"header": header_path, "main": main_path, "footer": footer_path, "full_page": full_page_path}

    except Exception as e:
        print(f"❌ Error processing {website_name}: {e}")
        return None

# --- CLIP-based scoring ---
@torch.no_grad()
def score_section(image_path, section_type, category):
    prompt = get_clip_prompt(section_type, category)
    processed_image_path = preprocess_image(image_path)
    
    image = Image.open(processed_image_path).convert("RGB")
    inputs = clip_processor(text=[prompt], images=image, return_tensors="pt", padding=True).to(device)

    outputs = clip_model(**inputs)
    image_embed = outputs.image_embeds
    text_embed = outputs.text_embeds

    image_embed = image_embed / image_embed.norm(p=2, dim=-1, keepdim=True)
    text_embed = text_embed / text_embed.norm(p=2, dim=-1, keepdim=True)

    similarity = cosine_similarity(image_embed, text_embed).item()
    normalized_similarity = (similarity + 1) / 2  # 0 to 1

    clarity_score = min(1.0, normalized_similarity + 0.1)
    modernity_score = min(1.0, normalized_similarity + 0.05)
    relevance_score = normalized_similarity
    consistency_score = min(1.0, normalized_similarity + 0.07)
    visual_appeal_score = min(1.0, normalized_similarity + 0.08)

    criteria_scores = {
        "Clarity": round(clarity_score, 2),
        "Modernity": round(modernity_score, 2),
        "Relevance": round(relevance_score, 2),
        "Consistency": round(consistency_score, 2),
        "Visual Appeal": round(visual_appeal_score, 2),
    }

    print(f"📷 {section_type.capitalize()} - {os.path.basename(processed_image_path)}: CLIP Score = {normalized_similarity:.3f}")

    return {
        "clip_score": normalized_similarity,
        "criteria_scores": criteria_scores
    }

# --- Compare websites ---
def compare_websites(websites, category):
    all_scores = {"header": [], "main": [], "footer": [], "full": []}

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

            for section_type in ["header", "main", "footer", "full"]:
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

        # Explanation paragraph
        # criteria = best["criteria"]
        # explanation = (
        #     f"\n📝 Why {best['name'].capitalize()}'s {section} is best:\n"
        #     f"The {section} section of {best['name'].capitalize()} stands out with a high semantic relevance score of {round(best['score'], 3)}, "
        #     f"indicating a strong alignment between visual design and expected content for a {category.lower()} website. "
        #     f"It demonstrates exceptional **clarity** ({criteria['Clarity']}), making navigation intuitive for users. "
        #     f"The design is **modern** ({criteria['Modernity']}), which helps build trust and reflects current UI trends. "
        #     f"The section maintains **consistency** ({criteria['Consistency']}) in branding and layout, while being highly **visually appealing** ({criteria['Visual Appeal']}), "
        #     f"which enhances user engagement. Overall, this section effectively balances aesthetics with functional design, making it the most suitable among the compared sites."
        # )
        # print(explanation)

# --- Run ---
websites = [
    {"name": "jio", "url": "https://www.jiomart.com/"},
    {"name": "flipkart", "url": "https://www.flipkart.com/"},
    {"name": "amazon", "url": "https://amazon.in/"},
]

compare_websites(websites, category="ecommerce")
