#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browser binaries
python -m playwright install

# Start the Flask app with gunicorn
gunicorn app:app
