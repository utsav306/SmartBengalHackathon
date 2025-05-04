from flask import Flask, request, jsonify, send_from_directory, redirect, abort
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

port=5000

# --- Flask API endpoint ---
@app.route('/compare_websites', methods=['POST'])
def compare_websites_api():
    try:
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract websites and category from the input data
        websites = data.get('websites', [])
        category = data.get('category', 'ecommerce')

        if not websites:
            return jsonify({"error": "No websites provided"}), 400

        print(f"Received data: {data}")
        print(f"Category: {category}")

        # Call the compare_websites function and get the scores
        scores = compare_websites(websites, category)
        return jsonify(scores), 200

    except Exception as e:
        # Log error for debugging
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Route to serve screenshot files - will redirect to Cloudinary if available
@app.route('/screenshots/<path:path>')
def serve_screenshots(path):
    try:
        # Parse the path to extract website name and filename
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
        local_path = os.path.join('screenshots', path)
        if os.path.exists(local_path):
            print(f"Serving local file: {path}")
            return send_from_directory('screenshots', path)
        
        # If file not found locally, return a 404 error
        print(f"Screenshot not found for {path}")
        abort(404, description="Screenshot not found.")

    except Exception as e:
        print(f"Error in serving screenshot: {str(e)}")
        return jsonify({"error": "Error serving screenshot"}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
