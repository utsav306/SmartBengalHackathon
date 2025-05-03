from flask import Flask, request, jsonify, send_from_directory
from website_comparison import compare_websites
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Flask API endpoint ---
@app.route('/compare_websites', methods=['POST'])
def compare_websites_api():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        print(f"Received data: {data}")
        websites = data.get('websites', [])
        category = data.get('category', 'ecommerce')

        if not websites:
            return jsonify({"error": "No websites provided"}), 400

        scores = compare_websites(websites, category)
        return jsonify(scores), 200

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Route to serve screenshot files
@app.route('/screenshots/<path:path>')
def serve_screenshots(path):
    return send_from_directory('screenshots', path)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
