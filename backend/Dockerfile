# Use Python slim image for smaller size
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Playwright, OpenCV, and others
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libx11-xcb1 \
    libgdk-pixbuf2.0-0 \
    libgbm-dev \
    wget \
    curl \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libgl1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright
RUN python -m playwright install

# Copy code
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
