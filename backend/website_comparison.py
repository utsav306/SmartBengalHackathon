import os
import torch
import cv2
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from torch.nn.functional import cosine_similarity
from playwright.sync_api import sync_playwright
import json
import sys
from pathlib import Path
from prettytable import PrettyTable

# Add local imports
sys.path.append(str(Path(__file__).parent))
from gemini import analyze_websites_with_gemini
from cloudinary_storage import init_cloudinary, upload_image, upload_website_screenshots

# Initialize Cloudinary if environment variables are set
init_cloudinary()

# Load CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
# clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
# clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
# clip_model.eval()
MODEL_DIR = Path("models/clip-vit-base-patch32")
MODEL_NAME = "openai/clip-vit-base-patch32"
if not MODEL_DIR.exists():
    print("⬇️ Downloading CLIP model...")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    clip_processor = CLIPProcessor.from_pretrained(MODEL_NAME)
    clip_processor.save_pretrained(MODEL_DIR)
    clip_model = CLIPModel.from_pretrained(MODEL_NAME)
    clip_model.save_pretrained(MODEL_DIR)
    print("✅ Model saved to disk.")
else:
    print("✅ Loading CLIP model from disk.")
    clip_processor = CLIPProcessor.from_pretrained(MODEL_DIR)
    clip_model = CLIPModel.from_pretrained(MODEL_DIR)

clip_model.to(device)
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
def preprocess_image(image_path):
    try:
        # Read the image
        image = cv2.imread(image_path)
        if image is None:
            print(f"Failed to read image from {image_path}")
            return None
            
        # Process the image
        enhanced_image = cv2.equalizeHist(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY))
        resized_image = cv2.resize(enhanced_image, (1280, 720))
        final_image = cv2.cvtColor(resized_image, cv2.COLOR_GRAY2BGR)
        
        # Create processed image path
        processed_image_path = image_path.replace(".png", "_processed.png")
        
        # Write the processed image
        cv2.imwrite(processed_image_path, final_image)
        
        return processed_image_path
    except Exception as e:
        print(f"Error preprocessing image {image_path}: {str(e)}")
        return None

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
        'div[class*="navbar"]', 'div[class*="top"]', '#masthead', '.page-header',
        '#site-header', '#main-header', '.app-header', '.layout-header', '#branding',
        'ytd-masthead', 'ytd-app > #masthead-container'
    ],
    "footer": [
        'footer', '.footer', '#footer', '#navFooter', '.site-footer', '.bottom-bar',
        'div[role="contentinfo"]', '.main-footer', '.global-footer', '.footer-wrapper',
        'div[class*="footer"]', 'div[class*="bottom"]', 'div[data-role="footer"]',
        '.site-info', '#colophon', '#page-footer', '.app-footer', '.layout-footer',
        'ytd-footer', 'ytd-app > #footer'
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

        # Full-page screenshot
        page.screenshot(path=full_page_path, full_page=True)

        if os.path.exists(full_page_path):
            print(f"✔️ Full-page screenshot captured for {website_name}")
        else:
            print(f"❌ Full-page screenshot failed for {website_name}")
            full_page_path = None  # Ensure it is None if not captured

        header.screenshot(path=header_path)

        if main_height > 50:
            page.screenshot(path=main_path, clip={'x': 0, 'y': header_bottom, 'width': 1280, 'height': main_height})
        else:
            print(f"⚠️ Main section too small for {website_name}. Skipping main.")
            main_path = None

        footer.screenshot(path=footer_path)

        # Store local paths for processing
        local_paths = {"header": header_path, "main": main_path, "footer": footer_path, "full": full_page_path}
        
        # Upload screenshots to Cloudinary
        cloudinary_urls = {}
        cloudinary_folder = f"website_screenshots/{website_name}"
        
        # Create a copy of the sections to avoid modifying during iteration
        sections_to_upload = {k: v for k, v in local_paths.items() if k in ["header", "main", "footer", "full"]}
        
        # Upload each section to Cloudinary
        for section, path in sections_to_upload.items():
            if path and os.path.exists(path):
                public_id = f"{website_name}_{section}"
                result = upload_image(path, public_id=public_id, folder=cloudinary_folder)
                
                if "error" not in result:
                    # Store the Cloudinary URL
                    cloudinary_urls[section] = result["url"]
                    # Add the Cloudinary URL to the local paths dictionary
                    local_paths[f"{section}_cloudinary_url"] = result["url"]
                else:
                    print(f"⚠️ Failed to upload {section} screenshot to Cloudinary: {result['error']}")
        
        return local_paths

    except Exception as e:
        print(f"❌ Error processing {website_name}: {e}")
        return None

# --- CLIP-based scoring ---
def score_section(image_path, section_type, category, cloudinary_url=None):
    prompt = get_clip_prompt(section_type, category)
    processed_image_path = None
    
    # Default scores in case of failure
    default_result = {
        "clip_score": 0.5,  # Default score
        "criteria_scores": {
            "Clarity": 0.5,
            "Modernity": 0.5,
            "Relevance": 0.5,
            "Consistency": 0.5,
            "Visual Appeal": 0.5,
        }
    }
    
    # First try Cloudinary URL if available
    if cloudinary_url:
        try:
            # Download image from Cloudinary URL
            import requests
            import tempfile
            
            print(f"Downloading image from Cloudinary URL: {cloudinary_url}")
            response = requests.get(cloudinary_url)
            if response.status_code == 200:
                # Save the image to a temporary file
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
                    temp_file.write(response.content)
                    temp_path = temp_file.name
                
                # Process the image
                processed_image_path = preprocess_image(temp_path)
                if not processed_image_path:
                    print("Failed to process Cloudinary image, falling back to local file")
                    processed_image_path = None
                else:
                    print(f"Successfully processed Cloudinary image to {processed_image_path}")
                
                # Clean up the temporary file if processing succeeded
                try:
                    os.remove(temp_path)
                except Exception as e:
                    print(f"Warning: Could not remove temp file: {str(e)}")
            else:
                print(f"Failed to download image from Cloudinary: HTTP {response.status_code}")
                processed_image_path = None
        except Exception as e:
            print(f"Error downloading image from Cloudinary: {str(e)}")
            processed_image_path = None
    
    # If Cloudinary failed or not available, try local file
    if not processed_image_path and image_path and os.path.exists(image_path):
        print(f"Using local file: {image_path}")
        processed_image_path = preprocess_image(image_path)
        if not processed_image_path:
            print(f"Failed to process local image: {image_path}")
            return default_result
    elif not processed_image_path:
        print(f"No valid image source available. Cloudinary URL: {cloudinary_url}, Local path: {image_path}")
        return default_result
    
    # Ensure the processed image exists
    if not os.path.exists(processed_image_path):
        print(f"Processed image not found: {processed_image_path}")
        return default_result
    
    try:
        # Process the image with CLIP
        image = Image.open(processed_image_path).convert("RGB")
        
        # Use torch.no_grad() to save memory during inference
        with torch.no_grad():
            inputs = clip_processor(text=[prompt], images=image, return_tensors="pt", padding=True).to(device)
            
            outputs = clip_model(**inputs)
            image_embed = outputs.image_embeds
            text_embed = outputs.text_embeds
            
            image_embed = image_embed / image_embed.norm(p=2, dim=-1, keepdim=True)
            text_embed = text_embed / text_embed.norm(p=2, dim=-1, keepdim=True)
            
            similarity = cosine_similarity(image_embed, text_embed).item()
            normalized_similarity = (similarity + 1) / 2  # 0 to 1
        
        # Calculate criteria scores
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
        
        # Clean up processed image file
        try:
            os.remove(processed_image_path)
        except Exception as e:
            print(f"Warning: Could not remove processed image file: {str(e)}")
        
        return {
            "clip_score": normalized_similarity,
            "criteria_scores": criteria_scores
        }
    except Exception as e:
        print(f"Error processing image with CLIP: {str(e)}")
        return default_result

# --- Get Gemini scores ---
def get_gemini_scores(website_data, category):
    """
    Get scores from Gemini API for each website and section.
    
    Args:
        website_data: List of dictionaries with website information including full screenshot paths
        category: Website category (e.g., "e-commerce")
        
    Returns:
        Dictionary with Gemini scores for each website section
    """
    # Prepare input for Gemini API
    gemini_input = []
    for site in website_data:
        # Use the full page screenshot
        sections = site.get("sections", {})
        full_path = sections.get("full")
        
        if full_path:
            # Check if we have a Cloudinary URL
            cloudinary_url = sections.get("full_cloudinary_url")
            
            if cloudinary_url:
                gemini_input.append({
                    "name": site["name"],
                    "url": site.get("url", ""),
                    "full_cloudinary_url": cloudinary_url
                })
            else:
                gemini_input.append({
                    "name": site["name"],
                    "url": site.get("url", ""),
                    "full_path": full_path
                })
    
    # If no screenshots are available, return empty scores
    if not gemini_input:
        print("No screenshots available for Gemini analysis")
        return {}
    
    # Call Gemini API
    print("Getting scores from Gemini API...")
    gemini_results = analyze_websites_with_gemini(gemini_input, category)
    
    # Check if there was an error
    if "error" in gemini_results:
        print(f"Error from Gemini API: {gemini_results['error']}")
        return {}
    
    # Print the full Gemini results for debugging
    print("\n=== FULL GEMINI RESULTS ===")
    print(json.dumps(gemini_results, indent=2))
    print("=== END OF GEMINI RESULTS ===\n")
    
    # Extract scores for each website and section
    gemini_scores = {}
    
    # Process the results from Gemini
    try:
        websites_data = gemini_results.get("websites", [])
        for website in websites_data:
            name = website.get("name")
            sections = website.get("sections", {})
            
            if name not in gemini_scores:
                gemini_scores[name] = {}
            
            # Map Gemini section names to our section types
            section_mapping = {
                "header": "header",
                "main_content": "main",
                "footer": "footer"
            }
            
            # Add overall score
            gemini_scores[name]["full"] = {
                "score": website.get("overall_score", 0) / 10.0,  # Convert to 0-1 scale
                "details": website
            }
            
            # Add section scores
            for gemini_section, our_section in section_mapping.items():
                if gemini_section in sections:
                    section_data = sections[gemini_section]
                    gemini_scores[name][our_section] = {
                        "score": section_data.get("score", 0) / 10.0,  # Convert to 0-1 scale
                        "details": section_data
                    }
    
    except Exception as e:
        print(f"Error processing Gemini results: {str(e)}")
    
    # Print the extracted scores in a readable format
    print("\n=== EXTRACTED GEMINI SCORES ===")
    for website_name, sections in gemini_scores.items():
        print(f"\n{website_name}:")
        for section_name, data in sections.items():
            score = data.get("score", 0)
            print(f"  {section_name.upper()}: {score:.3f}")
            
            # Print strengths and weaknesses if available
            details = data.get("details", {})
            if section_name == "full":
                print(f"  Overall Score: {details.get('overall_score', 0)}/10")
            else:
                strengths = details.get("strengths", [])
                weaknesses = details.get("weaknesses", [])
                recommendations = details.get("recommendations", [])
                
                if strengths:
                    print("    Strengths:")
                    for s in strengths[:2]:  # Print first 2 strengths
                        print(f"     - {s}")
                
                if weaknesses:
                    print("    Weaknesses:")
                    for w in weaknesses[:2]:  # Print first 2 weaknesses
                        print(f"     - {w}")
                
                if recommendations:
                    print("    Recommendations:")
                    for r in recommendations[:1]:  # Print first recommendation
                        print(f"     - {r}")
    print("=== END OF EXTRACTED SCORES ===\n")
    
    return gemini_scores

# --- Combine CLIP and Gemini scores ---
def combine_scores(clip_scores, gemini_scores):
    """
    Combine CLIP and Gemini scores into a final comprehensive score.
    
    Args:
        clip_scores: Dictionary with CLIP scores for each website section
        gemini_scores: Dictionary with Gemini scores for each website section
        
    Returns:
        Dictionary with combined scores
    """
    combined_scores = {"header": [], "main": [], "footer": [], "full": []}
    
    print("\n=== COMBINED SCORES ===")
    # Process each section type
    for section_type in ["header", "main", "footer", "full"]:
        print(f"\n{section_type.upper()} SECTION:")
        
        for clip_entry in clip_scores.get(section_type, []):
            name = clip_entry.get("name")
            clip_score = clip_entry.get("score", 0)
            
            # Get corresponding Gemini score if available
            gemini_score = 0
            gemini_details = {}
            if name in gemini_scores and section_type in gemini_scores[name]:
                gemini_score = gemini_scores[name][section_type].get("score", 0)
                gemini_details = gemini_scores[name][section_type].get("details", {})
            
            # Combine scores
            combined_score = (0.4*clip_score + 0.6*gemini_score) if gemini_score > 0 else clip_score
            
            # Print the scores for this section and website
            print(f"  {name}:")
            print(f"    CLIP Score:     {clip_score:.3f}")
            print(f"    Gemini Score:   {gemini_score:.3f}")
            print(f"    Combined Score: {combined_score:.3f}")
            
            # Create combined entry
            combined_entry = {
                "name": name,
                "path": clip_entry.get("path"),
                "clip_score": clip_score,
                "gemini_score": gemini_score,
                "combined_score": combined_score,
                "criteria": clip_entry.get("criteria", {}),
                "gemini_details": gemini_details
            }
            
            combined_scores[section_type].append(combined_entry)
    
    print("=== END OF COMBINED SCORES ===\n")
    
    # Print final summary table
    print("\n=== FINAL SUMMARY ===")
    website_scores = {}
    
    # Prepare data
    for section_type in ["header", "main", "footer", "full"]:
        for entry in combined_scores.get(section_type, []):
            name = entry.get("name")
            if name not in website_scores:
                website_scores[name] = {}
            website_scores[name][section_type] = entry.get("combined_score", 0)
    
    # Print header
    print(f"{'Website':<10} {'Header':<10} {'Main':<10} {'Footer':<10} {'Overall':<10}")
    print("-" * 50)
    
    # Print each website's scores
    for name, sections in website_scores.items():
        header = sections.get("header", 0)
        main = sections.get("main", 0)
        footer = sections.get("footer", 0)
        overall = sections.get("full", 0)
        
        print(f"{name:<10} {header:<10.3f} {main:<10.3f} {footer:<10.3f} {overall:<10.3f}")
    
    print("=== END OF FINAL SUMMARY ===\n")
    
    return combined_scores

# --- Print scores in a table format ---
def print_scores_table(combined_scores):
    """
    Print scores in a formatted table
    """
    # First, rearrange the data to be website-centric
    website_scores = {}
    
    for section_type in ["header", "main", "footer", "full"]:
        for entry in combined_scores.get(section_type, []):
            name = entry.get("name")
            
            if name not in website_scores:
                website_scores[name] = {}
            
            website_scores[name][section_type] = {
                "clip": entry.get("clip_score", 0),
                "gemini": entry.get("gemini_score", 0),
                "combined": entry.get("combined_score", 0)
            }
    
    # Now print a table for each website
    for website_name, sections in website_scores.items():
        print(f"\n--- {website_name} Scores ---")
        
        table = PrettyTable()
        table.field_names = ["Section", "CLIP Score", "Gemini Score", "Combined Score"]
        
        for section in ["header", "main", "footer", "full"]:
            if section in sections:
                scores = sections[section]
                table.add_row([
                    section.upper(),
                    f"{scores['clip']:.3f}",
                    f"{scores['gemini']:.3f}",
                    f"{scores['combined']:.3f}"
                ])
        
        print(table)
    
    # Also print a comparison table
    print("\n--- Website Comparison (Combined Scores) ---")
    comparison_table = PrettyTable()
    comparison_table.field_names = ["Website", "Header", "Main", "Footer", "Overall"]
    
    for website_name, sections in website_scores.items():
        row = [website_name]
        for section in ["header", "main", "footer", "full"]:
            if section in sections:
                row.append(f"{sections[section]['combined']:.3f}")
            else:
                row.append("N/A")
        
        comparison_table.add_row(row)
    
    print(comparison_table)

# --- Compare websites with combined CLIP and Gemini ---
def compare_websites_combined(websites, category):
    """
    Compare websites using both CLIP and Gemini, combining the scores.
    
    Args:
        websites: List of dictionaries with website name and URL
        category: Website category
        
    Returns:
        Dictionary with combined scores for each section
    """
    website_data = []
    
    # Capture screenshots
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 3000})

        for site in websites:
            name, url = site['name'], site['url']
            page = context.new_page()
            sections = capture_sections_and_fullpage(page, url, name)
            page.close()

            if sections:
                website_data.append({
                    "name": name,
                    "url": url,
                    "sections": sections
                })
        
        browser.close()
    
    # Get CLIP scores
    clip_scores = {"header": [], "main": [], "footer": [], "full": []}
    
    print("\n--- CLIP Scoring Results ---")
    for site in website_data:
        name = site["name"]
        sections = site["sections"]
        
        for section_type in ["header", "main", "footer", "full"]:
            image_path = sections.get(section_type)
            cloudinary_url = sections.get(f"{section_type}_cloudinary_url")
            
            if image_path:
                # Pass both the local path and Cloudinary URL (if available)
                result = score_section(image_path, section_type, category, cloudinary_url=cloudinary_url)
                print(f"{name} {section_type.upper()}: CLIP Score = {result['clip_score']:.3f}")
                
                # Create entry with both local path and Cloudinary URL
                entry = {
                    "name": name,
                    "path": image_path,
                    "score": result["clip_score"],
                    "criteria": result["criteria_scores"]
                }
                
                # Add Cloudinary URL if available
                if cloudinary_url:
                    entry["cloudinary_url"] = cloudinary_url
                    
                clip_scores[section_type].append(entry)
    
    # Get Gemini scores
    print("\n--- Getting Gemini Scores ---")
    gemini_scores = get_gemini_scores(website_data, category)
    
    # Print Gemini scores
    print("\n--- Gemini Scoring Results ---")
    for website_name, sections in gemini_scores.items():
        for section_type, data in sections.items():
            score = data.get("score", 0)
            print(f"{website_name} {section_type.upper()}: Gemini Score = {score:.3f}")
    
    # Combine scores
    print("\n--- Combined Scoring Results ---")
    combined_scores = combine_scores(clip_scores, gemini_scores)
    
    # Print formatted tables
    print_scores_table(combined_scores)
    
    return combined_scores

# --- Compare websites (original method) ---
def compare_websites(websites, category):
    """
    Compare websites using both CLIP and Gemini scores.
    
    Args:
        websites: List of dictionaries with website name and URL
        category: Website category
        
    Returns:
        Dictionary with scores for each section, now incorporating both CLIP and Gemini
    """
    all_scores = {"header": [], "main": [], "footer": [], "full": []}
    website_data = []
    
    # First, capture screenshots and collect website data
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 3000})

        for site in websites:
            name = site['name']
            url = site['url']
            page = context.new_page()
            sections = capture_sections_and_fullpage(page, url, name)
            page.close()

            if sections:
                website_data.append({
                    "name": name,
                    "url": url,
                    "sections": sections
                })

        browser.close()
    
    # Calculate CLIP scores for each section
    for site in website_data:
        name = site["name"]
        sections = site["sections"]

        for section_type in ["header", "main", "footer", "full"]:
            image_path = sections.get(section_type)
            cloudinary_url = sections.get(f"{section_type}_cloudinary_url")
            
            if image_path:
                # Pass both the local path and Cloudinary URL (if available)
                result = score_section(image_path, section_type, category, cloudinary_url=cloudinary_url)
                print(f"{name} {section_type}: CLIP Score = {result['clip_score']:.3f}")
                
                # Create entry with both local path and Cloudinary URL
                entry = {
                    "name": name,
                    "path": image_path,
                    "score": result["clip_score"],
                    "criteria": result["criteria_scores"]
                }
                
                # Add Cloudinary URL if available
                if cloudinary_url:
                    entry["cloudinary_url"] = cloudinary_url
                    
                all_scores[section_type].append(entry)

    # Now get Gemini scores for full-page analysis of sections
    print("\nGetting Gemini scores...")
    
    # Prepare input for Gemini API
    gemini_input = []
    for site in website_data:
        full_path = site["sections"].get("full")
        if full_path:
            gemini_input.append({
                "name": site["name"],
                "url": site["url"],
                "full_path": full_path
            })
    
    # Call Gemini API to get vision improvements and section scores
    gemini_results = analyze_websites_with_gemini(gemini_input, category)
    
    # Extract websites from Gemini results
    gemini_website_data = {}
    if "websites" in gemini_results:
        for website in gemini_results["websites"]:
            name = website.get("name")
            gemini_website_data[name] = website
    
    # Add vision improvements directly to the result
    all_scores["websites"] = gemini_results.get("websites", [])
    all_scores["comparison"] = gemini_results.get("comparison", {})
    
    # Get section scores from Gemini
    gemini_scores = {}
    
    for name, website in gemini_website_data.items():
        sections = website.get("sections", {})
        
        if name not in gemini_scores:
            gemini_scores[name] = {}
        
        # Map Gemini section names to our section types
        section_mapping = {
            "header": "header",
            "main_content": "main",
            "footer": "footer"
        }
        
        # Add overall score
        gemini_scores[name]["full"] = {
            "score": website.get("overall_score", 0) / 10.0,  # Convert to 0-1 scale
            "details": website
        }
        
        # Add section scores
        for gemini_section, our_section in section_mapping.items():
            if gemini_section in sections:
                section_data = sections[gemini_section]
                gemini_scores[name][our_section] = {
                    "score": section_data.get("score", 0) / 10.0,  # Convert to 0-1 scale
                    "details": section_data
                }
    
    # Combine CLIP and Gemini scores
    print("\nCombining CLIP and Gemini scores...")
    for section_type in ["header", "main", "footer", "full"]:
        updated_entries = []
        
        for entry in all_scores[section_type]:
            name = entry.get("name")
            clip_score = entry.get("score", 0)
            
            # Get Gemini score if available
            gemini_score = 0
            if name in gemini_scores and section_type in gemini_scores[name]:
                gemini_score = gemini_scores[name][section_type].get("score", 0)
                # Extract gemini details
                details = gemini_scores[name][section_type].get("details", {})
                
                # Add strengths and weaknesses to the entry if available
                if section_type != "full" and details:
                    strengths = details.get("strengths", [])
                    weaknesses = details.get("weaknesses", [])
                    recommendations = details.get("recommendations", [])
                    
                    entry["gemini_strengths"] = strengths
                    entry["gemini_weaknesses"] = weaknesses
                    entry["gemini_recommendations"] = recommendations
            
            # Calculate combined score
            combined_score = (clip_score + gemini_score) / 2 if gemini_score > 0 else clip_score
            
            # Add Gemini and combined scores to the entry
            entry["gemini_score"] = gemini_score
            entry["combined_score"] = combined_score
            entry["score"] = combined_score  # Replace original score with combined score
            
            print(f"{name} {section_type}: CLIP={clip_score:.3f}, Gemini={gemini_score:.3f}, Combined={combined_score:.3f}")
            
            updated_entries.append(entry)
        
        # Update the section scores
        all_scores[section_type] = updated_entries
    
    # Print summary table
    print("\n=== FINAL SUMMARY ===")
    print(f"{'Website':<10} {'Header':<10} {'Main':<10} {'Footer':<10} {'Overall':<10}")
    print("-" * 50)
    
    website_summaries = {}
    for section_type in ["header", "main", "footer", "full"]:
        for entry in all_scores[section_type]:
            name = entry.get("name")
            if name not in website_summaries:
                website_summaries[name] = {}
            website_summaries[name][section_type] = entry.get("combined_score", 0)
    
    for name, sections in website_summaries.items():
        header = sections.get("header", 0)
        main = sections.get("main", 0)
        footer = sections.get("footer", 0)
        overall = sections.get("full", 0)
        
        print(f"{name:<10} {header:<10.3f} {main:<10.3f} {footer:<10.3f} {overall:<10.3f}")

    return all_scores

# Example usage
if __name__ == "__main__":
    websites = [
        {"name": "Amazon", "url": "https://www.amazon.com"},
        {"name": "Flipkart", "url": "https://www.flipkart.com"},
        {"name": "Blinkit", "url": "https://blinkit.com"}
    ]
    
    print("Comparing websites with combined CLIP and Gemini analysis...")
    results = compare_websites_combined(websites, "e-commerce")
    
    # Print results
    print("\nDetailed JSON Results:")
    print(json.dumps(results, indent=2))
