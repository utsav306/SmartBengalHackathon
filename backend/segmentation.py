import cv2
import pytesseract
from PIL import Image
import os
from google import genai

# Set up Tesseract path (adjust if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize the GenAI client
client = genai.Client(api_key="")  # 9🔁 Replace with your actual API key

def extract_text_from_image(image_path):
    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        return None

    image = cv2.imread(image_path)
    if image is None:
        print("❌ OpenCV failed to read the image. Please check format or path.")
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    extracted_text = pytesseract.image_to_string(gray)
    print("✅ Extracted Text:\n", extracted_text)
    return extracted_text.strip()

def get_relevance_score(text, category):
    prompt = f"Assess the relevance of the following text to the category: {category}. Text: {text}. Give the score out of 10 only."

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        score = response.text.strip()
        return score
    except Exception as e:
        print("❌ Error generating relevance score:", e)
        return None

def main():
    image_path = "flipkart.png"  # 🔁 Update if using a different image
    category_input = input("🔹 Enter the category to compare relevance against: ")

    extracted_text = extract_text_from_image(image_path)
    if extracted_text:
        score = get_relevance_score(extracted_text, category_input)
        if score:
            print(f"\n🎯 Relevance Score (out of 10): {score}")
        else:
            print("⚠ Failed to get a relevance score.")
    else:
        print("⚠ No text extracted from the image.")

if _name_ == "_main_":
    main()
