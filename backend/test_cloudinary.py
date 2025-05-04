import os
import sys
from pathlib import Path
import requests
from dotenv import load_dotenv
from cloudinary_storage import init_cloudinary, upload_image, get_url

# Load environment variables from .env file
load_dotenv()

# Initialize Cloudinary
init_cloudinary()

def test_cloudinary_upload():
    """Test uploading an image to Cloudinary and getting its URL"""
    # Create a test image URL
    test_image_url = "https://th.bing.com/th/id/OIP.0iqvqUM-_MntTZp4CMBaigHaEK?w=316&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    
    # Download the test image
    print(f"Downloading test image from {test_image_url}")
    response = requests.get(test_image_url)
    
    if response.status_code == 200:
        # Save the image to a temporary file
        temp_path = "temp_test_image.jpg"
        with open(temp_path, "wb") as f:
            f.write(response.content)
        
        # Upload the image to Cloudinary
        print(f"Uploading test image to Cloudinary")
        result = upload_image(temp_path, public_id="test_image", folder="test")
        
        # Check if upload was successful
        if "error" not in result:
            print(f"Successfully uploaded image to Cloudinary")
            print(f"Cloudinary URL: {result['url']}")
            
            # Test getting the URL
            url = get_url("test/test_image")
            print(f"Retrieved URL: {url}")
            
            # Clean up the temporary file
            os.remove(temp_path)
            return True
        else:
            print(f"Error uploading image to Cloudinary: {result['error']}")
    else:
        print(f"Error downloading test image: HTTP {response.status_code}")
    
    return False

if __name__ == "__main__":
    test_cloudinary_upload()
