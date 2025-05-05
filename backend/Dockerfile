# Use Python slim image for smaller size
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies for Playwright and others
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libgdk-pixbuf2.0-0 \
    libgbm-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright and the required browsers
RUN python -m playwright install


# Copy the rest of the application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Command to run your Python app
CMD ["python", "app.py"]
