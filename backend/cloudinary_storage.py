import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url

# Initialize Cloudinary configuration
def init_cloudinary():
    """Initialize Cloudinary with credentials from environment variables"""
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
        api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
        secure=True
    )

# Upload an image to Cloudinary
def upload_image(image_path, public_id=None, folder="screenshots"):
    """
    Upload an image to Cloudinary
    
    Args:
        image_path: Path to the local image file
        public_id: Optional public ID for the image
        folder: Folder in Cloudinary to store the image
        
    Returns:
        Dictionary with upload result including URL
    """
    if not os.path.exists(image_path):
        return {"error": f"File not found: {image_path}"}
    
    try:
        # If public_id is not provided, use the filename without extension
        if not public_id:
            public_id = os.path.splitext(os.path.basename(image_path))[0]
            
        # Upload the image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image_path,
            public_id=public_id,
            folder=folder,
            overwrite=True
        )
        
        return {
            "public_id": upload_result["public_id"],
            "url": upload_result["secure_url"],
            "original_path": image_path
        }
    except Exception as e:
        return {"error": str(e), "original_path": image_path}

# Get the URL for an image
def get_image_url(public_id, folder="screenshots"):
    """
    Get the URL for an image stored in Cloudinary
    
    Args:
        public_id: Public ID of the image
        folder: Folder in Cloudinary where the image is stored
        
    Returns:
        URL for the image
    """
    try:
        full_public_id = f"{folder}/{public_id}" if folder else public_id
        url, options = cloudinary_url(full_public_id)
        return url
    except Exception as e:
        return None

# Delete an image from Cloudinary
def delete_image(public_id, folder="screenshots"):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: Public ID of the image
        folder: Folder in Cloudinary where the image is stored
        
    Returns:
        Dictionary with deletion result
    """
    try:
        full_public_id = f"{folder}/{public_id}" if folder else public_id
        result = cloudinary.uploader.destroy(full_public_id)
        return result
    except Exception as e:
        return {"error": str(e)}

# Upload a batch of images to Cloudinary
def upload_batch(image_paths, folder="screenshots"):
    """
    Upload multiple images to Cloudinary
    
    Args:
        image_paths: List of paths to local image files
        folder: Folder in Cloudinary to store the images
        
    Returns:
        List of dictionaries with upload results
    """
    results = []
    for image_path in image_paths:
        result = upload_image(image_path, folder=folder)
        results.append(result)
    return results

# Upload a website's screenshots to Cloudinary
def upload_website_screenshots(website_name, screenshots_folder="screenshots"):
    """
    Upload all screenshots for a website to Cloudinary
    
    Args:
        website_name: Name of the website
        screenshots_folder: Base folder for screenshots
        
    Returns:
        Dictionary mapping section names to Cloudinary URLs
    """
    website_folder = os.path.join(screenshots_folder, website_name)
    if not os.path.exists(website_folder):
        return {"error": f"Website folder not found: {website_folder}"}
    
    # Get all PNG files in the website folder
    image_files = [f for f in os.listdir(website_folder) if f.endswith('.png')]
    
    # Upload each image and track URLs by section
    cloudinary_urls = {}
    cloudinary_folder = f"website_screenshots/{website_name}"
    
    for image_file in image_files:
        image_path = os.path.join(website_folder, image_file)
        public_id = os.path.splitext(image_file)[0]
        
        # Upload the image
        result = upload_image(image_path, public_id=public_id, folder=cloudinary_folder)
        
        if "error" not in result:
            # Extract section from filename (e.g., "Amazon_header.png" -> "header")
            section = public_id.split('_')[-1]
            if section in ["header", "main", "footer", "full"]:
                cloudinary_urls[section] = result["url"]
            elif "processed" in section:
                # Handle processed images (e.g., "Amazon_header_processed.png")
                base_section = section.replace("_processed", "")
                cloudinary_urls[f"{base_section}_processed"] = result["url"]
    
    return cloudinary_urls
