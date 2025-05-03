import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from PIL import Image
import os

# For Windows - set Tesseract path if needed
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

image_path = "screenshots/amazon/amazon_full.png"  # Path to your image file


# Check if image exists
if not os.path.exists(image_path):
    print(f"❌ File not found: {image_path}")
    exit()

image = cv2.imread(image_path)

# If OpenCV fails to load the image
if image is None:
    print("❌ OpenCV failed to read the image. Please check format or path.")
    exit()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

text = pytesseract.image_to_string(gray)
print("✅ Extracted Text:\n", text)