from google import genai
from google.genai import types
import json
import os
import time
import re
import requests

# Initialize the Gemini API client
api_key = "AIzaSyDZ7FcRos1l9R5K66MCXreueB_epGt67mM"
if not api_key:
    print("Warning: GOOGLE_API_KEY environment variable not set")

try:
    # Initialize the Gemini client with the API key
    client = genai.Client(api_key=api_key)
    print("Successfully initialized Gemini API client")
except Exception as e:
    print(f"Error initializing Gemini API client: {str(e)}")
    client = None

def analyze_websites_with_gemini(websites, category="e-commerce"):
    """
    Analyze and compare websites using Google's Gemini API.
    Takes full page screenshots and analyzes different sections in a single API call.
    
    Args:
        websites: List of dictionaries containing website names and their full screenshot paths or URLs
        category: Website category (default: "e-commerce")
        
    Returns:
        Dict containing scores and analysis for each website and their sections
    """
    results = {}
    
    # Check if Gemini client is initialized
    if client is None:
        print("Gemini API client not initialized. Skipping Gemini analysis.")
        return {
            "error": "Gemini API client not initialized",
            "websites": [{
                "name": website.get("name", "Unknown"),
                "url": website.get("url", ""),
                "overall_score": 7,  # Default score
                "screenshot": website.get("full_cloudinary_url", website.get("full_path", ""))
            } for website in websites]
        }
    
    print("Starting website analysis...")
    
    # Collect screenshots for all websites
    image_parts = []
    website_names = []
    website_urls = []
    contents = []
    
    # First part of the prompt is text
    contents.append(f"Compare the following {category} websites and provide detailed analysis.")
    
    for website in websites:
        name = website["name"]
        url = website.get("url", f"https://{name.lower()}.com")
        
        print(f"Processing {name}...")
        
        # Check if we have a Cloudinary URL
        if "full_cloudinary_url" in website:
            image_url = website["full_cloudinary_url"]
            print(f"Using Cloudinary URL for {name}: {image_url}")
            
            try:
                # Download image from Cloudinary URL
                print(f"Downloading image from Cloudinary for {name}...")
                response = requests.get(image_url)
                if response.status_code == 200:
                    image_bytes = response.content
                    # Add image directly to contents list like in check.py
                    contents.append(types.Part.from_bytes(data=image_bytes, mime_type="image/png"))
                    website_names.append(name)
                    website_urls.append(url)
                    print(f"Successfully downloaded {name} screenshot from Cloudinary")
                else:
                    print(f"Failed to download image from Cloudinary for {name}: HTTP {response.status_code}")
                    continue
            except Exception as e:
                print(f"Error downloading image from Cloudinary for {name}: {str(e)}")
                continue
                
        # Fallback to local file path if Cloudinary URL is not available
        elif "full_path" in website:
            full_image_path = website["full_path"]
            
            # Check if file exists
            if not os.path.exists(full_image_path):
                print(f"Warning: Image file {full_image_path} not found for {name}")
                continue
                
            try:
                # Read image file and create Part object
                print(f"Reading local image file for {name}...")
                with open(full_image_path, "rb") as f:
                    image_bytes = f.read()
                # Add image directly to contents list like in check.py
                contents.append(types.Part.from_bytes(data=image_bytes, mime_type="image/png"))
                website_names.append(name)
                website_urls.append(url)
                print(f"Successfully read {name} screenshot from local file")
            except Exception as e:
                print(f"Error reading local image file for {name}: {str(e)}")
                continue
        else:
            print(f"Warning: No image source found for {name}")
            continue
    
    # Check if any website images were found
    if not website_names:
        return {"error": "No valid website images found. Please check the paths or URLs."}
    
    print(f"Successfully processed {len(website_names)} website screenshots: {', '.join(website_names)}")
    
    # Add detailed instructions to the contents list
    analysis_prompt = f"""
    For the {len(website_names)} {category} websites shown in the images ({', '.join(website_names)}), provide a detailed analysis.
    
    For each website, evaluate these key sections:
    1. Header section
    2. Main content section
    3. Footer section
    
    For each section of each website, provide:
    - A score from 1-10
    - Strengths (2-3 points)
    - Weaknesses (2-3 points)
    - Recommendations for improvement (1-2 points)
    
    Additionally, for each website, provide detailed visual design improvement recommendations in these categories:
    - Color Scheme: Analyze current colors and suggest specific improvements with color codes
    - Typography: Evaluate text readability and suggest font improvements
    - Layout: Analyze spacing, alignment and suggest layout improvements
    - Visual Hierarchy: Evaluate importance signaling and suggest visual hierarchy improvements
    - Whitespace: Analyze use of whitespace and suggest improvements
    - Responsive Design: Assess adaptability to different screen sizes
    - Accessibility: Evaluate color contrast, text size, and suggest accessibility improvements
    
    Also provide an overall score from 1-10 for each website.
    
    Return your response in JSON format with the following structure for each website:
    {{
        "websites": [
            {{
                "name": "[website name]",
                "url": "[website url]",
                "overall_score": [score from 1-10],
                "sections": {{
                    "header": {{
                        "score": [score from 1-10],
                        "strengths": ["strength1", "strength2", ...],
                        "weaknesses": ["weakness1", "weakness2", ...],
                        "recommendations": ["recommendation1", "recommendation2", ...]
                    }},
                    "main_content": {{
                        "score": [score from 1-10],
                        "strengths": ["strength1", "strength2", ...],
                        "weaknesses": ["weakness1", "weakness2", ...],
                        "recommendations": ["recommendation1", "recommendation2", ...]
                    }},
                    "footer": {{
                        "score": [score from 1-10],
                        "strengths": ["strength1", "strength2", ...],
                        "weaknesses": ["weakness1", "weakness2", ...],
                        "recommendations": ["recommendation1", "recommendation2", ...]
                    }}
                }},
                "vision_improvements": {{
                    "color_scheme": {{
                        "current_analysis": "analysis of current color scheme",
                        "recommendations": ["specific color improvement1", "specific color improvement2", ...]
                    }},
                    "typography": {{
                        "current_analysis": "analysis of current typography",
                        "recommendations": ["specific typography improvement1", "specific typography improvement2", ...]
                    }},
                    "layout": {{
                        "current_analysis": "analysis of current layout",
                        "recommendations": ["specific layout improvement1", "specific layout improvement2", ...]
                    }},
                    "visual_hierarchy": {{
                        "current_analysis": "analysis of current visual hierarchy",
                        "recommendations": ["specific visual hierarchy improvement1", "specific visual hierarchy improvement2", ...]
                    }},
                    "whitespace": {{
                        "current_analysis": "analysis of current use of whitespace",
                        "recommendations": ["specific whitespace improvement1", "specific whitespace improvement2", ...]
                    }},
                    "responsive_design": {{
                        "current_analysis": "analysis of current responsive design",
                        "recommendations": ["specific responsive design improvement1", "specific responsive design improvement2", ...]
                    }},
                    "accessibility": {{
                        "current_analysis": "analysis of current accessibility",
                        "recommendations": ["specific accessibility improvement1", "specific accessibility improvement2", ...]
                    }}
                }}
            }},
            ...
        ]
    }}
    """
    
    # Replace the first element with the detailed prompt
    contents[0] = analysis_prompt
    
    # Prepare the Gemini API request
    try:
        print("Sending request to Gemini API...")
        
        # Make the API request using the contents list directly, just like in check.py
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents
        )
        
        print(f"Gemini API response received successfully")
        # No need to calculate elapsed time as it's not being used elsewhere
        
        # Extract JSON from the response
        response_text = response.text
        
        # Clean up response if it has markdown code blocks
        if "```json" in response_text:
            print("Found JSON in markdown code block, extracting...")
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
                print("Successfully extracted JSON from markdown")
        
        # Parse the response
        try:
            print("Parsing JSON response...")
            results = json.loads(response_text)
            print("Successfully parsed response")
            
            # Process the results to add screenshot paths
            if "websites" in results:
                for i, website in enumerate(results["websites"]):
                    # Add screenshot URL if not present
                    if "screenshot" not in website:
                        # Use Cloudinary URL if available, otherwise use local path
                        if "full_cloudinary_url" in websites[i]:
                            website["screenshot"] = websites[i]["full_cloudinary_url"]
                        elif "full_path" in websites[i]:
                            website["screenshot"] = websites[i]["full_path"]
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {str(e)}")
            # Try to clean up common JSON issues
            try:
                # Remove any non-JSON text before or after the JSON
                if response_text.strip().startswith("{") and response_text.strip().endswith("}"):
                    fixed_text = response_text.strip()
                    results = json.loads(fixed_text)
                    print("Fixed JSON parsing issue")
                else:
                    # Try to find the JSON object
                    json_match = re.search(r'({.*})', response_text, re.DOTALL)
                    if json_match:
                        fixed_text = json_match.group(1)
                        results = json.loads(fixed_text)
                        print("Found and parsed JSON object")
                    else:
                        raise Exception("Couldn't find valid JSON object")
            except Exception as e2:
                print(f"Failed to fix JSON: {str(e2)}")
                results = {
                    "error": "Failed to parse JSON response",
                    "raw_response": response_text[:1000] + "..." if len(response_text) > 1000 else response_text
                }
    except Exception as e:
        print(f"Error in Gemini API call: {str(e)}")
        results = {
            "error": f"API call failed: {str(e)}"
        }
    
    return results


# Example usage
if __name__ == "__main__":
    # Construct the correct paths relative to where the script is run
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Example full page screenshots for Amazon, Flipkart, and Blinkit
    websites = [
        {
            "name": "Amazon",
            "url": "https://www.amazon.com",
            "full_path": os.path.join(script_dir, "screenshots/Amazon/Amazon_full.png")
        },
        {
            "name": "Flipkart",
            "url": "https://www.flipkart.com",
            "full_path": os.path.join(script_dir, "screenshots/Flipkart/Flipkart_full.png")
        },
        {
            "name": "Blinkit",
            "url": "https://blinkit.com",
            "full_path": os.path.join(script_dir, "screenshots/Blinkit/Blinkit_full.png")
        }
    ]
    
    print("Starting website comparison...")
    
    # Run analysis
    results = analyze_websites_with_gemini(websites)
    
    # Print results
    if "error" in results:
        print(f"Error: {results['error']}")
        if "raw_response" in results:
            print("\nRaw response snippet:")
            print(results["raw_response"][:500] + "..." if len(results["raw_response"]) > 500 else results["raw_response"])
    else:
        print("\nDetailed JSON Results:")
        print(json.dumps(results, indent=2))
