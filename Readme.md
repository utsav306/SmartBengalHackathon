# Smart Bengal Hackathon - Website Comparison Tool

A comprehensive web application that allows users to compare websites based on different categories. The application uses AI to analyze websites and provide detailed comparisons and suggestions for improvements.

## Project Structure

This project consists of two main parts:

- **Frontend**: A React application built with Vite
- **Backend**: A Flask API that handles website comparison and analysis

## Features

- Website comparison across different categories (e-commerce, educational, etc.)
- Text analysis for website content
- Vision improvements suggestions
- Screenshot capture and analysis
- AI-powered recommendations

## Prerequisites

### Frontend
- Node.js (v16+)
- npm or yarn

### Backend
- Python 3.8+
- pip

## Installation

### Clone the repository
```bash
git clone <repository-url>
cd sbh2k25-frontend1
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

#### Running Frontend Locally

To ensure the frontend works correctly with your local backend:

1. Open `src/components/ApiService.js` or the file that contains your API configuration
2. Update the API base URL to point to your local backend:
```javascript
// Change this line
const API_BASE_URL = 'https://production-api.example.com';
// To this
const API_BASE_URL = 'http://localhost:5000';
```
3. If you're using environment variables, you can also create a `.env.local` file in the frontend directory with:
```
VITE_API_URL=http://localhost:5000
```

4. For production deployment, make sure to update the API URL back to your production endpoint

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python app.py
```

The backend API will be available at http://localhost:5000

#### API Configuration

1. For local development, the backend is configured to run on `http://localhost:5000` by default
2. If you need to change the port or host, modify the `app.py` file:
```python
# Change this line at the bottom of app.py
app.run(debug=True)
# To specify a different host/port
app.run(host='0.0.0.0', port=8000, debug=True)
```

3. For production deployment:
   - Set `debug=False` in `app.py`
   - Consider using a WSGI server like Gunicorn or uWSGI
   - Set up proper CORS configuration in `app.py` to restrict access to your frontend domain:
   ```python
   # Instead of the default CORS setup
   CORS(app)  # This allows all origins
   
   # Use this for production
   CORS(app, resources={r"/*": {"origins": "https://your-frontend-domain.com"}})
   ```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Use the landing page to navigate to different features
3. To compare websites:
   - Go to the analyze page
   - Enter the URLs of the websites you want to compare
   - Select a category
   - Submit and view the comparison results

## API Endpoints

### Compare Websites
- **URL**: `/compare_websites`
- **Method**: POST
- **Body**:
  ```json
  {
    "websites": ["https://example1.com", "https://example2.com"],
    "category": "ecommerce"
  }
  ```
- **Response**: JSON object with comparison scores and analysis

### Get Screenshots
- **URL**: `/screenshots/<path>`
- **Method**: GET
- **Response**: Screenshot image file

## Development

### Frontend

The frontend is built with:
- React 19
- React Router 7
- Tailwind CSS 4
- Vite 6

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

### Backend

The backend uses:
- Flask 3.1
- Flask-CORS 5.0
- Google Gemini AI
- OpenCV
- Playwright for web scraping

## Project Structure

```
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── website_comparison.py
│   ├── gemini.py
│   ├── segmentation.py
│   ├── imtext.py
│   └── requirements.txt
└── README.md
```

## Troubleshooting

### Frontend Issues

- If you encounter dependency issues, try deleting the `node_modules` folder and running `npm install` again
- For routing issues, make sure your React Router configuration is correct in `App.jsx`

### Backend Issues

- If you encounter Python package conflicts, use a virtual environment
- For API connection issues, ensure CORS is properly configured
- If screenshots aren't working, make sure Playwright is properly installed


## License

This project is licensed under the MIT License - see the LICENSE file for details.
