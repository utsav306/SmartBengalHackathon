from flask import Flask, request, jsonify, send_from_directory, redirect
from website_comparison import compare_websites
from flask_cors import CORS
import os
from dotenv import load_dotenv
from cloudinary_storage import init_cloudinary, get_image_url

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Cloudinary
init_cloudinary()

# --- Flask API endpoint ---
@app.route('/compare_websites', methods=['POST'])
def compare_websites_api():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        print(f"Received data: {data}")
        print(f"Received data type: {data['category']}")
        websites = data.get('websites', [])
        category = data.get('category', 'ecommerce')

        if not websites:
            return jsonify({"error": "No websites provided"}), 400

        scores = compare_websites(websites, category)
        return jsonify(scores), 200

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Route to serve screenshot files - will redirect to Cloudinary if available
@app.route('/screenshots/<path:path>')
def serve_screenshots(path):
    # Parse the path to extract website name and section
    parts = path.split('/')
    if len(parts) >= 2:
        website_name = parts[0]
        filename = parts[1]
        
        # Try to get Cloudinary URL
        public_id = filename.split('.')[0]  # Remove file extension
        cloudinary_folder = f"website_screenshots/{website_name}"
        cloudinary_url = get_image_url(public_id, folder=cloudinary_folder)
        
        if cloudinary_url:
            print(f"Redirecting to Cloudinary URL: {cloudinary_url}")
            return redirect(cloudinary_url)
    
    # Fallback to local file if Cloudinary URL not available
    print(f"Serving local file: {path}")
    return send_from_directory('screenshots', path)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)